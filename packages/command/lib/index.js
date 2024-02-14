class Command {
  constructor(instance) {
    if (!instance) {
      throw new Error("command instance must not be null!");
    }
    this.program = instance;

    //注册命令
    const cmd = this.program.command(this.command);
    //命令的描述
    cmd.description(this.description);
    // 钩子函数
    cmd.hook("preAction", () => {
      this.preAction();
    });

    cmd.hook("postAction", () => {
      this.postAction();
    });
    
    // 命令参数处理
    if (this.options?.length > 0) {
      this.options.forEach((option) => {
        cmd.option(...option);
      });
    }

    cmd.action((...params) => {
      this.action(params);
    });
  }

  get command() {
    throw new Error("command must be implements");
  }

  get description() {
    throw new Error("description must be implements");
  }

  get options() {
    return [];
  }
  get action() {
    throw new Error("action must be implements");
  }

  preAction() {}

  postAction() {}
}

export default Command;
