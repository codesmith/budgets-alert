import * as cdk from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import type { SnsStackProps } from "./sns-stack"
import * as chatbot from "aws-cdk-lib/aws-chatbot";

export class ChatbotStack extends cdk.Stack {

  // Chatbot
  private createChatbot(name: string, sns: sns.Topic): chatbot.SlackChannelConfiguration {
    const slackWorkspaceId = this.node.tryGetContext("slackWorkspaceId"); // Contextで指定したslackworkspaceidを取得
    const slackChannelId = this.node.tryGetContext("slackChannelId"); // Contextで指定したslackchannelidを取得

    const slackchatbot = new chatbot.SlackChannelConfiguration(this, `${name}`, {
      slackChannelConfigurationName: name,
      slackWorkspaceId: slackWorkspaceId, // 事前にコンソール上でchatbotがslackworkspaceにアクセスする権限を与えていること
      slackChannelId: slackChannelId,
      loggingLevel: chatbot.LoggingLevel.INFO,
      notificationTopics: [sns],
    });
    return slackchatbot;
  }

  constructor(scope: cdk.App, id: string, SnsStack: SnsStackProps, props?: cdk.StackProps) {
    super(scope, id, props);

    const prefix = this.node.tryGetContext("prefix"); // Contextで指定したprefixを取得

    this.createChatbot(`${prefix}-chatbot`, SnsStack.snsTopic);
  }
}