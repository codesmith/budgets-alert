#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SnsStack } from "../lib/sns-stack";
import { ChatbotStack } from "../lib/chatbot-stack";
import { BudgetStack } from "../lib/budget-stack";
import { CostAnomalyStack } from "../lib/costanomaly-stack";
import * as dotenv from "dotenv";

// .envファイルから環境変数を読み込む
dotenv.config();
const app = new cdk.App();

// 環境変数をCDKアプリケーションのコンテキストに渡す
const slackWorkspaceId = process.env.SLACK_WORKSPACE_ID;
const slackChannelId = process.env.SLACK_CHANNEL_ID;

// 以前のコンテキスト値を読み込み、新しい環境変数で上書きする
app.node.setContext("slackWorkspaceId", slackWorkspaceId);
app.node.setContext("slackChannelId", slackChannelId);

const snsStack = new SnsStack(app, `sns-stack`,{
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1"},
});
const chatbotStack = new ChatbotStack(app, `chatbot-stack`, snsStack,);
const budgetStack = new BudgetStack(app, `budget-stack`, snsStack,{
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1"},
});
const costanomalyStack = new CostAnomalyStack(app, `costanomaly-stack`, snsStack,{
    env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: "us-east-1"},
});

chatbotStack.addDependency(snsStack);
budgetStack.addDependency(snsStack);
costanomalyStack.addDependency(snsStack);