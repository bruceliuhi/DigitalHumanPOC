class Orchestrator {
    constructor() {
        this.state = 'IDLE'; // IDLE, ASK_AGE, ASK_INCOME, ASK_ID, DONE
    }

    processInput(text) {
        if (!text) return null;

        let responseText = null;

        // --- 全局指令 ---
        if (text.includes('重置') || text.includes('reset')) {
            this.state = 'IDLE';
            responseText = "会话已重置。";
        }
        else if (['信用卡', '办卡', '开始'].some(k => text.includes(k))) {
            this.state = 'ASK_AGE';
            responseText = "您好，我是智能理财顾问。我可以帮您快速评估信用卡申请资格。首先，请问您的年龄是否介于 20 到 65 岁之间？";
        }

        // --- 状态机逻辑 ---
        else if (this.state === 'ASK_AGE') {
            if (['是', '对', '20'].some(k => text.includes(k))) {
                this.state = 'ASK_INCOME';
                responseText = "好的。接下来，请问您目前是否有稳定的收入来源？";
            } else {
                // 简单处理：如果回答否定或无关，回到 IDLE 或提示
                // 这里为了演示流畅，如果不匹配也暂不打断流程，除非明确拒绝
                if (['不', '没有'].some(k => text.includes(k))) {
                    this.state = 'IDLE';
                    responseText = "抱歉，目前由于年龄限制，您可能暂时无法申请。";
                }
            }
        }
        else if (this.state === 'ASK_INCOME') {
            if (['有', '是', '对'].some(k => text.includes(k))) {
                this.state = 'ASK_ID';
                responseText = "收到。最后确认一下，您是否持有本地身份证？";
            } else if (['不', '没有'].some(k => text.includes(k))) {
                this.state = 'IDLE';
                responseText = "了解了，申请需要稳定收入来源，感谢您的咨询。";
            }
        }
        else if (this.state === 'ASK_ID') {
            if (['有', '是', '对'].some(k => text.includes(k))) {
                const caseId = 'PRE-' + Math.floor(Math.random() * 10000);
                this.state = 'IDLE';
                responseText = `恭喜您，根据初步评估，您符合申请条件。已为您建立申请档案，编号为 ${caseId}。`;
            } else if (['不', '没有'].some(k => text.includes(k))) {
                this.state = 'IDLE';
                responseText = "好的，感谢您的配合。";
            }
        }

        // --- 构造返回消息 ---
        // 即使没有触发状态机也返回 asrText 以便前端显示
        return {
            type: 'dialogue.reply',
            asrText: text,
            assistantText: responseText, // 如果为 null，前端不播报
            state: this.state
        };
    }
}

module.exports = Orchestrator;
