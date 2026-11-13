# ⛔ 已废弃（DEPRECATED）

这个仓库是早期用另一套方案（27 个桩、6+ 轮 CI 卡在 expo-sqlite web 的 wa-sqlite worker）做的失败尝试，**不要再使用、不要参考、不要基于它继续**。

现行可用版本在：

- 仓库：https://github.com/jq470/cherry-studio-web
- 成品包：https://raw.githubusercontent.com/jq470/cherry-studio-web/dist/cherry-studio-web.zip

区别：新仓库直接基于官方 `CherryHQ/cherry-studio-app` 最新源码，只做配置补丁 + 平台桩层 + 构建流水线，业务代码零改动；CI 实测主界面渲染、onboarding、刷新持久化、SQLite（官方 sqlite-wasm，FTS5 可用）全部通过。

本仓库保留仅作历史记录，已停止维护。
