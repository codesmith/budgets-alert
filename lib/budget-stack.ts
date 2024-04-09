import * as cdk from "aws-cdk-lib";
import { aws_budgets as budgets } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import type { SnsStackProps } from "./sns-stack"

export class BudgetStack extends cdk.Stack {

  // Budget
  private createBudget(name: string, sns: sns.Topic, amount: number): budgets.CfnBudget {
    const budget = new budgets.CfnBudget(this, `${name}`,{
      budget:{
        budgetName: `${name}`,
        budgetType: `COST`,
        timeUnit: `MONTHLY`,
        budgetLimit: {
          amount: amount, // Contextで予算上限を指定
          unit: "USD"
        },
        costTypes: {
          includeCredit: false,
          includeDiscount: true,
          includeOtherSubscription: true,
          includeRecurring: true,
          includeRefund: false,
          includeSubscription: true,
          includeSupport: true,
          includeTax: true,
          includeUpfront: true,
          useAmortized: true,
          useBlended: false,
        },
      },
      notificationsWithSubscribers: [{
        notification: {
          comparisonOperator: 'GREATER_THAN',
          notificationType: 'ACTUAL',
          threshold: 100,
          thresholdType: 'PERCENTAGE',
        },
        subscribers: [{
          address: `${sns.topicArn}`,
          subscriptionType: 'SNS',
        }],
      }],
    })
    return budget;
  }

  constructor(scope: cdk.App, id: string, SnsStack: SnsStackProps, props?: cdk.StackProps) {
    super(scope, id, props);

    const prefix = this.node.tryGetContext("prefix"); // Contextで指定したprefixを取得

    const amounts = this.node.tryGetContext("amounts"); // Contextで指定したamountを取得
    amounts.forEach((amount: number) => {
      this.createBudget(`${prefix}-budget-monitoring-${amount}`, SnsStack.snsTopic, amount);
    });
  }
}
