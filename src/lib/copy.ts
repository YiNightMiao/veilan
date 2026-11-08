export type Lang = "zh" | "en";

export type Copy = {
  nav: {
    desktop: string;
    principles: string;
    release: string;
    machine: string;
    open: string;
    close: string;
  };
  hero: {
    kicker: string;
    title: string;
    lead: string;
    try: string;
    release: string;
    note: string;
    logoAlt: string;
  };
  desktop: {
    heading: string;
    caption: string;
    aria: string;
    veil: string;
    empty: string;
    close: string;
    noticeKicker: string;
    notice: string;
    dismiss: string;
    apps: { notes: string; files: string; term: string; system: string };
    noteDate: string;
    noteBody: string;
    files: { group: string; items: string[] }[];
    term: string[];
    sys: {
      channel: string;
      memory: string;
      veil: string;
      display: string;
      channelV: string;
      memoryV: string;
      veilOn: string;
      veilOff: string;
      displayV: string;
    };
  };
  principles: {
    kicker: string;
    title: string;
    items: { title: string; body: string }[];
  };
  scope: {
    kicker: string;
    title: string;
    lead: string;
    has: string;
    hasNot: string;
    hasItems: string[];
    hasNotItems: string[];
  };
  release: {
    kicker: string;
    title: string;
    lead: string;
    cta: string;
    specs: { k: string; v: string }[];
    now: string;
    timeline: { date: string; title: string; body: string; now?: boolean }[];
  };
  machine: {
    kicker: string;
    title: string;
    lead: string;
    arch: string;
    mem: string;
    disk: string;
    name: string;
    namePh: string;
    sheet: string;
    file: string;
    size: string;
    sizeX86: string;
    sizeArm: string;
    result: string;
    copy: string;
    copied: string;
    copyFail: string;
    local: string;
    bad: { title: string; detail: string };
    tight: { title: string; detail: string };
    good: { title: string; detail: string };
  };
  footer: { rights: string; note: string };
};

export const copy: Record<Lang, Copy> = {
  zh: {
    nav: {
      desktop: "桌面",
      principles: "原则",
      release: "版本",
      machine: "机器",
      open: "打开菜单",
      close: "关闭菜单",
    },
    hero: {
      kicker: "新生操作系统 · 公开预览 2026.11",
      title: "一台更安静的电脑。",
      lead: "Veilan 是 Veilan 团队正在做的桌面系统。它记住窗口的位置，让通知自己离开，并把你没在看的东西退后半步。",
      try: "试一试桌面",
      release: "看版本",
      note: "安装镜像还没发布。桌面可以现在试。",
      logoAlt: "Veilan 团队",
    },
    desktop: {
      heading: "桌面长这样",
      caption: "点程序坞打开应用，拖标题栏移动窗口。薄纱打开时，没在看的窗口会退后。",
      aria: "Veilan 桌面预览",
      veil: "薄纱",
      empty: "从下面的程序坞打开一个应用。",
      close: "收起窗口",
      noticeKicker: "通知",
      notice: "预览通道已就绪。这条通知八秒后自己离开。",
      dismiss: "现在收起",
      apps: { notes: "笔记", files: "文件", term: "终端", system: "系统" },
      noteDate: "11 月 8 日",
      noteBody: "窗口会留在原地。\n通知数到八秒就走。\n余光里的东西，只是退后。",
      files: [
        { group: "预览", items: ["说明.txt", "桌面.veil"] },
        { group: "系统", items: ["2026.11"] },
      ],
      term: ["$ veil status", "channel    2026.11-veil", "veil       on", "windows    remembered"],
      sys: {
        channel: "通道",
        memory: "内存",
        veil: "薄纱",
        display: "显示",
        channelV: "2026.11 Veil",
        memoryV: "6.1 / 8 GB",
        veilOn: "开",
        veilOff: "关",
        displayV: "桌面",
      },
    },
    principles: {
      kicker: "只做三件事",
      title: "桌面不跟你抢。",
      items: [
        {
          title: "窗口记得住",
          body: "关掉再打开，还在上次的位置。这一页也会记住你拖开的布局，直到你换浏览器。",
        },
        {
          title: "通知会离开",
          body: "八秒。不需要处理的提示自己收起。要留下的，才进托盘。",
        },
        {
          title: "薄纱只退后",
          body: "没在用的窗口降低对比、略微虚化。不缩小，不飞走。眼睛知道它们还在。",
        },
      ],
    },
    scope: {
      kicker: "公开预览",
      title: "这一版有，和还没有。",
      lead: "新生系统不把路线图写成已经完成的功能。",
      has: "有",
      hasNot: "还没有",
      hasItems: [
        "一个桌面，一条程序坞",
        "可拖动的窗口，并在这台浏览器里记住位置",
        "薄纱",
        "笔记、文件、终端、系统",
        "x86_64 与 ARM64 两套说明",
      ],
      hasNotItems: ["多桌面", "应用商店", "账户和同步", "可以下载的安装镜像"],
    },
    release: {
      kicker: "Veil · 2026.11",
      title: "预览通道，还不是安装器。",
      lead: "公开预览叫 Veil。下面是这版打算跑在什么机器上，以及它是怎么走到这里的。",
      cta: "看看这台机器",
      specs: [
        { k: "通道", v: "2026.11 Veil" },
        { k: "架构", v: "x86_64 · ARM64" },
        { k: "内存", v: "4 GB 起，8 GB 合适" },
        { k: "磁盘", v: "32 GB" },
        { k: "显示", v: "1280 × 800 起" },
        { k: "许可", v: "预览免费，1.0 前写明" },
      ],
      now: "现在",
      timeline: [
        { date: "2026.03", title: "草案", body: "显示和调度拆开，先不谈界面。" },
        { date: "2026.06", title: "窗口", body: "第一块能拖动、能记住的窗口。" },
        { date: "2026.09", title: "薄纱", body: "没聚焦的窗口开始退后，而不是消失。" },
        { date: "2026.11", title: "预览", body: "你正在看的这一版。", now: true },
        { date: "2027.04", title: "1.0", body: "安装器，以及一份写清楚的许可。" },
      ],
    },
    machine: {
      kicker: "要求",
      title: "这台机器，跑不跑得动。",
      lead: "选架构、内存和磁盘。结论按公开预览的要求来，不会离开这台浏览器。",
      arch: "架构",
      mem: "内存",
      disk: "磁盘",
      name: "机器名称",
      namePh: "工作室的笔记本",
      sheet: "Veilan 预览清单",
      file: "文件",
      size: "体积",
      sizeX86: "约 2.4 GB（计划，尚未发布）",
      sizeArm: "约 2.2 GB（计划，尚未发布）",
      result: "结论",
      copy: "复制清单",
      copied: "已复制",
      copyFail: "没复制成，请手动选择上面的文字",
      local: "选择只保存在这台浏览器里。",
      bad: {
        title: "磁盘不够",
        detail: "2026.11 需要 32 GB 可用空间。16 GB 装不下系统本身。",
      },
      tight: {
        title: "能开，会紧",
        detail: "4 GB 可以进桌面。薄纱和几个窗口一起开时会挤。建议 8 GB。",
      },
      good: {
        title: "适合这版预览",
        detail: "内存和磁盘都够。镜像还没发布，清单可以先留着。",
      },
    },
    footer: {
      rights: "© 2026 Veilan 团队",
      note: "页面上的桌面是预览界面，不是安装包。",
    },
  },
  en: {
    nav: {
      desktop: "Desktop",
      principles: "Principles",
      release: "Release",
      machine: "Machine",
      open: "Open menu",
      close: "Close menu",
    },
    hero: {
      kicker: "A new operating system · Public preview 2026.11",
      title: "A quieter computer.",
      lead: "Veilan is the desktop Veilan Team is building. It remembers where windows were, lets notices leave, and steps back whatever you are not looking at.",
      try: "Try the desktop",
      release: "See the release",
      note: "No install image yet. The desktop is here to try.",
      logoAlt: "Veilan Team",
    },
    desktop: {
      heading: "This is the desktop",
      caption: "Open apps from the dock. Drag a title bar to move a window. With Veil on, anything you are not using steps back.",
      aria: "Veilan desktop preview",
      veil: "Veil",
      empty: "Open an app from the dock.",
      close: "Put window away",
      noticeKicker: "Notice",
      notice: "The preview channel is ready. This notice leaves in eight seconds.",
      dismiss: "Dismiss",
      apps: { notes: "Notes", files: "Files", term: "Terminal", system: "System" },
      noteDate: "8 Nov",
      noteBody: "Windows stay where you left them.\nNotices count to eight, then go.\nEverything else only steps back.",
      files: [
        { group: "Preview", items: ["readme.txt", "desktop.veil"] },
        { group: "System", items: ["2026.11"] },
      ],
      term: ["$ veil status", "channel    2026.11-veil", "veil       on", "windows    remembered"],
      sys: {
        channel: "Channel",
        memory: "Memory",
        veil: "Veil",
        display: "Display",
        channelV: "2026.11 Veil",
        memoryV: "6.1 / 8 GB",
        veilOn: "On",
        veilOff: "Off",
        displayV: "Desktop",
      },
    },
    principles: {
      kicker: "Three things",
      title: "The desktop does not compete with you.",
      items: [
        {
          title: "Windows stay put",
          body: "Close one and open it again: same place. This page remembers the layout you drag, until you switch browsers.",
        },
        {
          title: "Notices leave",
          body: "Eight seconds. A prompt that needs nothing from you puts itself away. What must stay goes to the tray.",
        },
        {
          title: "Veil only steps back",
          body: "Unused windows lose contrast and go slightly soft. They do not shrink and they do not fly off. Your eye still knows they are there.",
        },
      ],
    },
    scope: {
      kicker: "Public preview",
      title: "In this build, and not yet.",
      lead: "A young system does not write the roadmap as if it already shipped.",
      has: "In",
      hasNot: "Not yet",
      hasItems: [
        "One desktop and one dock",
        "Windows you can drag, remembered in this browser",
        "Veil",
        "Notes, Files, Terminal, System",
        "Notes for both x86_64 and ARM64",
      ],
      hasNotItems: ["Extra desktops", "An app store", "Accounts and sync", "An install image you can download"],
    },
    release: {
      kicker: "Veil · 2026.11",
      title: "A preview channel, not an installer.",
      lead: "The public preview is called Veil. This is the machine it expects, and how it got here.",
      cta: "Check this machine",
      specs: [
        { k: "Channel", v: "2026.11 Veil" },
        { k: "Arch", v: "x86_64 · ARM64" },
        { k: "Memory", v: "4 GB minimum, 8 GB comfortable" },
        { k: "Disk", v: "32 GB" },
        { k: "Display", v: "1280 × 800 and up" },
        { k: "License", v: "Free in preview, stated before 1.0" },
      ],
      now: "Now",
      timeline: [
        { date: "2026.03", title: "Draft", body: "Display split from the scheduler. No interface talk yet." },
        { date: "2026.06", title: "Windows", body: "The first window that could be dragged and remembered." },
        { date: "2026.09", title: "Veil", body: "Unfocused windows step back instead of vanishing." },
        { date: "2026.11", title: "Preview", body: "The build you are looking at.", now: true },
        { date: "2027.04", title: "1.0", body: "An installer, and a license written in plain language." },
      ],
    },
    machine: {
      kicker: "Requirements",
      title: "Will this machine run it.",
      lead: "Pick an architecture, memory, and disk. The verdict follows the public preview rules and never leaves this browser.",
      arch: "Architecture",
      mem: "Memory",
      disk: "Disk",
      name: "Machine name",
      namePh: "studio laptop",
      sheet: "Veilan preview sheet",
      file: "File",
      size: "Size",
      sizeX86: "about 2.4 GB (planned, not published)",
      sizeArm: "about 2.2 GB (planned, not published)",
      result: "Verdict",
      copy: "Copy sheet",
      copied: "Copied",
      copyFail: "Could not copy. Select the text above.",
      local: "Choices stay in this browser.",
      bad: {
        title: "Not enough disk",
        detail: "2026.11 needs 32 GB free. 16 GB cannot hold the system.",
      },
      tight: {
        title: "It will open, tightly",
        detail: "4 GB reaches the desktop. Veil plus a few windows will feel cramped. 8 GB is the comfortable line.",
      },
      good: {
        title: "Ready for this preview",
        detail: "Memory and disk are enough. The image is not published yet. Keep the sheet.",
      },
    },
    footer: {
      rights: "© 2026 Veilan Team",
      note: "The desktop on this page is a preview, not an install image.",
    },
  },
};
