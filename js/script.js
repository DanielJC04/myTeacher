/* =============================================
   myTEACHER — script.js  (versión simplificada)
   Solo 3 funciones esenciales:
   1. Menú hamburguesa (móvil)
   2. Tags de búsqueda rápida
   3. Smooth scroll
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. MENÚ HAMBURGUESA */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  /* 2. TAGS DE BÚSQUEDA RÁPIDA */
  const searchInput = document.getElementById('searchInput');
  const tags = document.querySelectorAll('.tag');

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('selected'));
      tag.classList.add('selected');
      if (searchInput) {
        searchInput.value = tag.textContent;
        searchInput.focus();
      }
    });
  });

  /* 3. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        navLinks.classList.remove('open');
      }
    });
  });

    document.getElementById('searchBtn')?.addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    const url = query
      ? `pages/search.html?q=${encodeURIComponent(query)}`
      : 'pages/search.html';
    window.location.href = url;
  });

});

/* 5. FUNCIÓN GLOBAL para los tags onclick del HTML */
function goToSearch(term) {
  window.location.href = `pages/search.html?q=${encodeURIComponent(term)}`;
}