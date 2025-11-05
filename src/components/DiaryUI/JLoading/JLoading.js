// 不再需要vue的h和render函数，以及element-plus的Loading图标
export default {
  mounted(el, binding, vnode) {
    const options = {
      loadingBackground: vnode.props['loading-background'],
      loadingIcon: vnode.props['loading-icon'],
      loadingText: vnode.props['loading-text'],
      loadingColor: vnode.props['loading-color'],
    };
    let text = null;

    el.style.position = 'relative';
    let JLoading = document.createElement('div');
    JLoading.classList.add('j-loading');
    let spinner = document.createElement('div');
    spinner.classList.add('j-loading-spinner');
    let loadingBar = document.createElement('div');
    loadingBar.classList.add('loading-bar');
    let icon = document.createElement('i');
    icon.classList.add('iconfont');
    icon.classList.add(options.loadingIcon || 'icon-loading1');

    if(options.loadingBackground){
      JLoading.style.backgroundColor = options.loadingBackground;
    };

    loadingBar.appendChild(icon);
    spinner.appendChild(loadingBar);
    
    if(options.loadingText){
      text = document.createElement('span');
      text.textContent = options.loadingText;
      spinner.appendChild(text);
    };
    if(options.loadingColor){
      icon.style.color = options.loadingColor;
      text.style.color = options.loadingColor;
    };
    JLoading.appendChild(spinner);
    binding.modifiers.fullscreen && (JLoading.style.position = 'fixed');
    binding.modifiers.lock && binding.value && (document.body.style.overflow = 'hidden');
    binding.modifiers.fullscreen ? document.body.appendChild(JLoading) : el.appendChild(JLoading);
  },
  updated(el, binding, vnode, prevVnode) {
    const loadingEl = binding.modifiers.fullscreen ? document.body.querySelector('.j-loading') : el.querySelector('.j-loading');
    if(binding.value){
      loadingEl.style.display = 'block';
      binding.modifiers.lock && binding.value && (document.body.style.overflow = 'hidden');
    }else {
      loadingEl.style.display = 'none'; 
      binding.modifiers.lock && (document.body.style.removeProperty('overflow'));
    };
  },
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode) {

  }
}