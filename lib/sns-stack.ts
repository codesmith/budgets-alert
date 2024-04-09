import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as iam from 'aws-cdk-lib/aws-iam';

export interface SnsStackProps { 
  readonly snsTopic: sns.Topic
}

export class SnsStack extends cdk.Stack {
  public readonly snsTopic: sns.Topic

  // SNS Topic
  private createSnsTopic(name: string): sns.Topic {

    const snsTopic = new sns.Topic(this, `${name}`, {
      displayName: "alert Nottification",
      topicName: name,
    });
    snsTopic.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'SNSPublishingPermissions',
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.ServicePrincipal('costalerts.amazonaws.com'),
        new iam.ServicePrincipal('budgets.amazonaws.com'),
      ],
      actions: ['SNS:Publish'],
      resources: [snsTopic.topicArn],
    }));
    return snsTopic;
  }

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const prefix = this.node.tryGetContext("prefix"); // Contextで指定したprefixを取得

    this.snsTopic = this.createSnsTopic(`${prefix}-sns-topic`);
  }
}
