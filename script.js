// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 获取元素
  const wallpaperImgs = document.querySelectorAll('.wallpaper-img');
  const previewModal = document.getElementById('previewModal');
  const previewImg = document.getElementById('previewImg');
  const closeModal = document.querySelector('.close-modal');
  const favoriteBtns = document.querySelectorAll('.favorite-btn');
  const downloadBtns = document.querySelectorAll('.download-btn');
  const previewDownloadBtn = document.querySelector('.preview-download-btn');
  
  let currentImageSrc = ''; // 记录当前预览图片的地址

  // 1. 图片加载完成后添加淡入效果
  wallpaperImgs.forEach(img => {
    // 如果图片已缓存，直接显示
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });

  // 2. 点击壁纸图片打开预览层
  wallpaperImgs.forEach(img => {
    img.addEventListener('click', function() {
      currentImageSrc = this.getAttribute('data-src');
      previewImg.setAttribute('src', currentImageSrc);
      previewModal.classList.add('show');
      // 禁止页面滚动
      document.body.style.overflow = 'hidden';
    });
  });

  // 3. 关闭预览层
  function closePreviewModal() {
    previewModal.classList.remove('show');
    // 恢复页面滚动
    document.body.style.overflow = 'auto';
  }

  closeModal.addEventListener('click', closePreviewModal);

  // 点击预览层空白处关闭
  previewModal.addEventListener('click', function(e) {
    if (e.target === this) {
      closePreviewModal();
    }
  });

  // 按ESC键关闭
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && previewModal.classList.contains('show')) {
      closePreviewModal();
    }
  });

  // 4. 收藏/取消收藏功能（本地存储记录）
  favoriteBtns.forEach(btn => {
    // 初始化：从本地存储读取收藏状态
    const item = btn.closest('.item');
    const imgSrc = item.querySelector('.wallpaper-img').getAttribute('data-src');
    const isFavorited = localStorage.getItem(`favorite_${imgSrc}`) === 'true';
    
    if (isFavorited) {
      btn.classList.add('active');
      btn.querySelector('i').classList.remove('fa-heart-o');
      btn.querySelector('i').classList.add('fa-heart');
    }

    // 点击切换收藏状态
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡（避免触发预览层）
      const imgSrc = this.closest('.item').querySelector('.wallpaper-img').getAttribute('data-src');
      
      if (this.classList.contains('active')) {
        // 取消收藏
        this.classList.remove('active');
        this.querySelector('i').classList.remove('fa-heart');
        this.querySelector('i').classList.add('fa-heart-o');
        localStorage.setItem(`favorite_${imgSrc}`, 'false');
      } else {
        // 收藏
        this.classList.add('active');
        this.querySelector('i').classList.remove('fa-heart-o');
        this.querySelector('i').classList.add('fa-heart');
        localStorage.setItem(`favorite_${imgSrc}`, 'true');
        // 简单的提示反馈
        alert('已收藏该壁纸！');
      }
    });
  });

  // 5. 下载功能
  function downloadImage(src, fileName) {
    const link = document.createElement('a');
    link.href = src;
    link.download = fileName || '壁纸';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 卡片内的下载按钮
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      const imgSrc = this.closest('.item').querySelector('.wallpaper-img').getAttribute('data-src');
      downloadImage(imgSrc);
    });
  });

  // 预览层的下载按钮
  previewDownloadBtn.addEventListener('click', function() {
    if (currentImageSrc) {
      downloadImage(currentImageSrc);
    }
  });
});