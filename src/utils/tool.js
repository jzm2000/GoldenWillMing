/**
 * 获取点击位置到按钮中心的距离
 * @param {Event} e - 点击事件对象
 * @returns {Object} - 包含半径、点击位置坐标的对象
 */
function getRadius(e) {
    // 获取按钮位置
    const x = e.clientX;
    const y = e.clientY;
    let WinX = window.innerWidth;
    let WinY = window.innerHeight;

    let MaxX = Math.max(x, WinX - x);
    let MaxY = Math.max(y, WinY - y);
    // 获取圆的半径
    const radius = Math.sqrt(MaxX * MaxX + MaxY * MaxY);
    return {
        radius,
        x,
        y,
    };
};
export { getRadius };