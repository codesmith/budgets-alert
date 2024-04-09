import * as cdk from "aws-cdk-lib";
import { aws_ce as ce } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import type { SnsStackProps } from "./sns-stack"

export interface CostAnomalyStackProps {
  readonly anomalymonitor: ce.CfnAnomalyMonitor
}

export class CostAnomalyStack extends cdk.Stack {
  public readonly anomalymonitor: ce.CfnAnomalyMonitor

  // Anomaly Monitor
  private createAnomalyMonitor(name: string): ce.CfnAnomalyMonitor {
    
    const anomalymonitor = new ce.CfnAnomalyMonitor(this, `${name}`,{
      monitorName: `${name}`,
      monitorType: 'DIMENSIONAL',
      monitorDimension: 'SERVICE',
    });
    return anomalymonitor;
  }

  // Anomaly Subscription
  private createAnomalySubscription(name: string, sns: sns.Topic, monitor: ce.CfnAnomalyMonitor): ce.CfnAnomalySubscription {
    
    const anomalysubscription = new ce.CfnAnomalySubscription(this, `${name}`,{
      frequency: 'IMMEDIATE',
      monitorArnList: [`${monitor.attrMonitorArn}`],
      subscribers: [{
        address: `${sns.topicArn}`,
        type: 'SNS',
        status: 'CONFIRMED',
      }],
      subscriptionName: `${name}`,
      threshold: 1, //　動作確認の為$1を指定
    });
    return anomalysubscription;
  }

  constructor(scope: cdk.App, id: string, SnsStack: SnsStackProps, props?: cdk.StackProps) {
    super(scope, id, props);

    const prefix = this.node.tryGetContext("prefix"); // Contextで指定したprefixを取得

    this.anomalymonitor = this.createAnomalyMonitor(`${prefix}-anomaly-monitor`);
    this.createAnomalySubscription(`${prefix}-anomaly-subscription`, SnsStack.snsTopic, this.anomalymonitor);
  }
}
