const themeConfig = {
  default: {
    "--primary-color": "#9e1f36",
    "--primary-rgb": "255, 255, 255",
    "--primary-light": "#d9b38c",
    "--secondary-color": "#f5e8c8",
    "--secondary-rgb": "245, 232, 200",
    "--accent-color": "#2d2327",
    "--text-color": "#333",
    "--text-light": "#2d2327",
    "--bg-color": "#f9f5eb",
    "--card-bg": "#ffffff",
    "--border-color": "#d9d9d9",
  },
  dark: {
    "--primary-color": "#1e3a2d",
    "--primary-rgb": "30, 58, 45",
    "--primary-light": "#345842",
    "--secondary-color": "#7d9d8c",
    "--secondary-rgb": "125, 157, 140",
    "--accent-color": "#9d7a56",
    "--text-color": "#e0e6e1",
    "--text-light": "#aab8b0",
    "--bg-color": "#0f1a14",
    "--card-bg": "#172820",
    "--border-color": "#2a4034"
  },
  purple: {
    '--primary-color': '#A87DC2', // 主色调：柔和的薰衣草紫（温柔、优雅，不刺眼）
    '--primary-rgb': '168, 125, 194',
    '--primary-light': '#E6D9F0',  // 主色浅色版：用于hover状态、次要强调
    
    // 辅助色：清新的淡玫瑰粉（与主色紫形成柔和对比）
    '--secondary-color': '#F2C4CE', 
    '--secondary-rgb': '242, 196, 206',
    
    // 强调色：温暖的珊瑚橙（用于按钮、重点标签，提亮画面）
    '--accent-color': '#FF9F8A', 
    
    // 文本主色：深灰紫（比纯黑柔和，与整体色调呼应）
    '--text-color': '#4A4453', 
    
    // 次要文本：浅灰紫（用于说明文字、辅助信息）
    '--text-light': '#9A94A4', 
    
    // 页面背景：极浅的粉白色（干净柔和，不刺眼）
    '--bg-color': '#FFFBF8', 
    
    // 卡片/组件背景：白色偏暖（比页面背景稍实，增加层次）
    '--card-bg': '#FFF5F7', 
    
    // 边框色：淡粉灰（弱化边框存在感，保持精致感）
    '--border-color': '#F0E8E8' 
  },
};
export {
    themeConfig
}