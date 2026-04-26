/* =============================================
   myTEACHER — dashboard.js
   Funcionalidades compartidas para:
   - dashboard-student.html
   - dashboard-tutor.html

   1. Navegación entre tabs del sidebar
   2. Filtro de sesiones (próximas/completadas/canceladas)
   3. Cancelar sesión
   4. Aceptar / Rechazar solicitudes (tutor)
   5. Modal de calificación (estudiante)
   6. Guardar perfil
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     1. NAVEGACIÓN ENTRE TABS
     Al hacer clic en un ítem del sidebar,
     oculta todos los tabs y muestra el que
     corresponde al data-tab del botón
  ══════════════════════════════════════════ */
  const navItems = document.querySelectorAll('.dash-nav-item');
  const tabs     = document.querySelectorAll('.dash-tab');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      // Quitar activo de todos
      navItems.forEach(n => n.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      // Activar el seleccionado
      item.classList.add('active');
      const tabId = 'tab-' + item.dataset.tab;
      document.getElementById(tabId)?.classList.add('active');
    });
  });


  /* ══════════════════════════════════════════
     2. FILTRO DE SESIONES
     Muestra solo las tarjetas cuyo data-status
     coincida con el filtro seleccionado
  ══════════════════════════════════════════ */
  const sessionTabs = document.querySelectorAll('.session-tab');

  sessionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Marcar tab activo
      sessionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      const cards  = document.querySelectorAll('.session-card');

      cards.forEach(card => {
        // Mostrar si el status coincide, ocultar si no
        const match = card.dataset.status === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });


  /* ══════════════════════════════════════════
     3. SELECTOR DE ESTRELLAS (modal calificación)
  ══════════════════════════════════════════ */
  const starSelector = document.getElementById('starSelector');
  let selectedStars  = 0;

  if (starSelector) {
    const stars = starSelector.querySelectorAll('span');

    stars.forEach(star => {
      // Hover: ilumina hasta esa estrella
      star.addEventListener('mouseover', () => {
        const val = parseInt(star.dataset.val);
        stars.forEach(s => {
          s.classList.toggle('active', parseInt(s.dataset.val) <= val);
        });
      });

      // Mouse sale: vuelve a la selección actual
      star.addEventListener('mouseout', () => {
        stars.forEach(s => {
          s.classList.toggle('active', parseInt(s.dataset.val) <= selectedStars);
        });
      });

      // Clic: guarda la selección
      star.addEventListener('click', () => {
        selectedStars = parseInt(star.dataset.val);
        stars.forEach(s => {
          s.classList.toggle('active', parseInt(s.dataset.val) <= selectedStars);
        });
      });
    });
  }

});


/* ══════════════════════════════════════════
   4. CANCELAR SESIÓN
   Se llama desde el onclick del botón.
   Pide confirmación y oculta la tarjeta.
══════════════════════════════════════════ */
function cancelSession(btn, sessionName) {
  const confirmed = confirm(`¿Seguro que quieres cancelar la sesión de ${sessionName}?`);
  if (!confirmed) return;

  // Encuentra la tarjeta más cercana y la oculta
  const card = btn.closest('.session-card') || btn.closest('.next-session-card');
  if (card) {
    card.style.opacity = '0';
    card.style.transition = 'opacity .3s';
    setTimeout(() => {
      card.style.display = 'none';
    }, 300);
  }
  alert(`Sesión de ${sessionName} cancelada.`);
}


/* ══════════════════════════════════════════
   5. ACEPTAR / RECHAZAR SOLICITUD (tutor)
══════════════════════════════════════════ */
function acceptRequest(cardId, studentName) {
  const card = document.getElementById(cardId);
  if (!card) return;

  card.style.opacity = '0';
  card.style.transition = 'opacity .3s';
  setTimeout(() => card.style.display = 'none', 300);

  alert(`✅ Solicitud de ${studentName} aceptada. Se añadió a tu agenda.`);
}

function rejectRequest(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;

  card.style.opacity = '0';
  card.style.transition = 'opacity .3s';
  setTimeout(() => card.style.display = 'none', 300);
}


/* ══════════════════════════════════════════
   6. MODAL DE CALIFICACIÓN (estudiante)
══════════════════════════════════════════ */
function openRating(tutorName) {
  document.getElementById('ratingTutorName').textContent =
    `Califica tu sesión con ${tutorName}`;
  document.getElementById('ratingModal').style.display = 'flex';
  document.getElementById('ratingComment').value = '';

  // Reset estrellas
  document.querySelectorAll('#starSelector span').forEach(s => s.classList.remove('active'));
}

function closeRating() {
  document.getElementById('ratingModal').style.display = 'none';
}

function submitRating() {
  const stars   = document.querySelectorAll('#starSelector span.active').length;
  const comment = document.getElementById('ratingComment').value.trim();

  if (stars === 0) {
    alert('Selecciona al menos una estrella.');
    return;
  }

  closeRating();
  alert(`¡Gracias por tu calificación de ${stars} estrella${stars > 1 ? 's' : ''}!`);
}

// Cerrar modal al hacer clic fuera
document.getElementById('ratingModal')?.addEventListener('click', function (e) {
  if (e.target === this) closeRating();
});


/* ══════════════════════════════════════════
   7. GUARDAR PERFIL
══════════════════════════════════════════ */
function saveProfile() {
  alert('✅ Cambios guardados correctamente.');
}