/* =============================================
   myTEACHER — search.js
   Detecta la página actual y activa el módulo
   correspondiente:
   - Módulo A: Búsqueda y filtros (search.html)
   - Módulo B: Perfil de tutor (tutor-profile.html)
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  const isSearch  = !!document.getElementById('tutorsGrid');
  const isProfile = !!document.getElementById('profileName');

  if (isSearch)  initSearch();
  if (isProfile) initProfile();

});


/* ══════════════════════════════════════════════
   MÓDULO A — BÚSQUEDA Y FILTROS
   ══════════════════════════════════════════════ */
function initSearch() {

  const cards        = document.querySelectorAll('.tutor-result-card');
  const resultsCount = document.getElementById('resultsCount');
  const emptyState   = document.getElementById('emptyState');
  const sortSelect   = document.getElementById('sortSelect');
  const searchInput  = document.getElementById('searchInput');
  const searchBtn    = document.getElementById('searchBtn');
  const clearBtn     = document.getElementById('clearFilters');
  const applyBtn     = document.getElementById('applyFilters');
  const resetEmpty   = document.getElementById('resetEmpty');

  // — — Lee los filtros activos — —
  function getFilters() {
    // Materias seleccionadas (checkboxes)
    const subjects = [...document.querySelectorAll('input[name="subject"]:checked')]
      .map(cb => cb.value);

    // Modalidad seleccionada (checkboxes)
    const modalities = [...document.querySelectorAll('input[name="modality"]:checked')]
      .map(cb => cb.value);

    // Rating mínimo (radio)
    const rating = parseFloat(
      document.querySelector('input[name="rating"]:checked')?.value || '0'
    );

    // Precio
    const priceMin = parseFloat(document.getElementById('priceMin').value) || 0;
    const priceMax = parseFloat(document.getElementById('priceMax').value) || Infinity;

    // Texto de búsqueda
    const text = searchInput.value.trim().toLowerCase();

    return { subjects, modalities, rating, priceMin, priceMax, text };
  }

  // — — Aplica filtros a las tarjetas — —
  function applyFilters() {
    const f = getFilters();
    let visible = 0;

    cards.forEach(card => {
      const cardSubjects  = card.dataset.subject.split(',');
      const cardModality  = card.dataset.modality.split(',');
      const cardRating    = parseFloat(card.dataset.rating);
      const cardPrice     = parseFloat(card.dataset.price);
      const cardName      = card.querySelector('.tutor-name').textContent.toLowerCase();
      const cardSubjectTxt = card.querySelector('.tutor-subject').textContent.toLowerCase();

      // Filtro por texto
      const matchText = !f.text ||
        cardName.includes(f.text) ||
        cardSubjectTxt.includes(f.text);

      // Filtro por materia
      const matchSubject = f.subjects.length === 0 ||
        f.subjects.some(s => cardSubjects.includes(s));

      // Filtro por modalidad
      const matchModality = f.modalities.length === 0 ||
        f.modalities.some(m => cardModality.includes(m));

      // Filtro por rating
      const matchRating = cardRating >= f.rating;

      // Filtro por precio
      const matchPrice = cardPrice >= f.priceMin && cardPrice <= f.priceMax;

      const show = matchText && matchSubject && matchModality && matchRating && matchPrice;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    resultsCount.textContent = visible;
    emptyState.style.display = visible === 0 ? 'block' : 'none';
  }

  // — — Ordena las tarjetas visibles — —
  function sortCards(criterion) {
    const grid      = document.getElementById('tutorsGrid');
    const cardArray = [...cards].filter(c => !c.classList.contains('hidden'));

    cardArray.sort((a, b) => {
      if (criterion === 'rating') {
        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
      }
      if (criterion === 'price-asc') {
        return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
      }
      if (criterion === 'price-desc') {
        return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
      }
      if (criterion === 'reviews') {
        return parseInt(b.dataset.reviews) - parseInt(a.dataset.reviews);
      }
    });

    // Reinserta en el DOM en el nuevo orden
    cardArray.forEach(c => grid.appendChild(c));
  }

  // — — Limpiar todos los filtros — —
  function clearAllFilters() {
    document.querySelectorAll('input[name="subject"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[name="modality"]').forEach(cb => cb.checked = false);
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    document.getElementById('priceMin').value = '';
    document.getElementById('priceMax').value = '';
    searchInput.value = '';
    applyFilters();
  }

  // — — Eventos — —
  applyBtn.addEventListener('click', () => {
    applyFilters();
    sortCards(sortSelect.value);
  });

  clearBtn.addEventListener('click', clearAllFilters);

  searchBtn.addEventListener('click', () => {
    applyFilters();
    sortCards(sortSelect.value);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      applyFilters();
      sortCards(sortSelect.value);
    }
  });

  sortSelect.addEventListener('change', () => sortCards(sortSelect.value));

  resetEmpty?.addEventListener('click', () => {
    clearAllFilters();
    sortCards(sortSelect.value);
  });

  // Aplicar orden inicial
  sortCards('rating');
}


/* ══════════════════════════════════════════════
   MÓDULO B — PERFIL DE TUTOR
   ══════════════════════════════════════════════ */

// Base de datos de tutores (en una app real vendrían de una API)
const TUTORS = {
  1: {
    name: 'Laura Gómez',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    subject: '📐 Matemáticas · Física',
    rating: 4.9,
    reviews: 128,
    price: 25,
    modalities: ['En línea', 'Presencial'],
    bio: 'Ingeniera Civil con maestría en Matemáticas Aplicadas y 5 años de experiencia enseñando cálculo diferencial e integral a nivel universitario. Me especializo en hacer que los conceptos más difíciles sean comprensibles y aplicables para cada estudiante.',
    experience: [
      'Ingeniera Civil — Universidad Nacional de Colombia',
      'Maestría en Matemáticas Aplicadas — Universidad de los Andes',
      'Tutora certificada con más de 500 horas de clases impartidas',
      'Preparación para exámenes ICFES, universitarios y posgrado',
    ],
    location: 'Barranquilla, Colombia',
    languages: 'Español, Inglés básico',
    responseTime: 'Responde en menos de 1 hora',
    totalClasses: '500+ clases impartidas',
    reviewList: [
      { name: 'Valentina Ríos', img: 'https://randomuser.me/api/portraits/women/12.jpg', date: 'Hace 2 semanas', stars: '★★★★★', text: 'Laura es increíble explicando. Gracias a ella pude aprobar mi examen de cálculo que tenía aplazado.' },
      { name: 'Juan Torres', img: 'https://randomuser.me/api/portraits/men/22.jpg', date: 'Hace 1 mes', stars: '★★★★★', text: 'Excelente metodología, muy paciente y explica los temas de diferentes maneras hasta que los entiendes.' },
      { name: 'Sara Molina', img: 'https://randomuser.me/api/portraits/women/34.jpg', date: 'Hace 2 meses', stars: '★★★★★', text: 'La mejor tutora que he tenido. Súper recomendada para quienes tienen dificultades con matemáticas.' },
    ],
  },
  2: {
    name: 'Carlos Martínez',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    subject: '🌐 Inglés · Francés',
    rating: 4.8,
    reviews: 96,
    price: 20,
    modalities: ['En línea'],
    bio: 'Licenciado en Lenguas Modernas con certificación Cambridge y experiencia en preparación IELTS, TOEFL y clases conversacionales. He ayudado a más de 200 estudiantes a alcanzar sus metas en inglés.',
    experience: [
      'Licenciado en Lenguas Modernas — Universidad del Atlántico',
      'Cambridge Certificate in English Language Teaching (CELTA)',
      'Especialista en preparación IELTS y TOEFL',
      'Clases conversacionales para profesionales',
    ],
    location: 'Barranquilla (solo en línea)',
    languages: 'Español, Inglés C2, Francés B2',
    responseTime: 'Responde en menos de 2 horas',
    totalClasses: '300+ clases impartidas',
    reviewList: [
      { name: 'Andrés Peña', img: 'https://randomuser.me/api/portraits/men/45.jpg', date: 'Hace 1 semana', stars: '★★★★★', text: 'Carlos me ayudó a subir mi puntaje del IELTS de 5.5 a 7.0 en solo 3 meses. Totalmente recomendado.' },
      { name: 'Luisa Caro', img: 'https://randomuser.me/api/portraits/women/56.jpg', date: 'Hace 3 semanas', stars: '★★★★★', text: 'Muy buen profesor, las clases son dinámicas y el vocabulario que enseña es muy útil para el día a día.' },
    ],
  },
  3: {
    name: 'Ana Torres',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    subject: '💻 Programación · IA',
    rating: 5.0,
    reviews: 74,
    price: 30,
    modalities: ['En línea'],
    bio: 'Desarrolladora fullstack con 7 años de experiencia en la industria y especialización en Machine Learning. He trabajado en startups y empresas de tecnología en Colombia y España. Actualmente enseño programación desde cero hasta nivel avanzado.',
    experience: [
      'Ingeniería de Sistemas — Universidad del Norte',
      'Especialización en Inteligencia Artificial — Coursera / DeepLearning.AI',
      'Desarrolladora senior en empresas tech de Colombia y España',
      'Instructora con más de 200 estudiantes formados en Python y JS',
    ],
    location: 'Barranquilla (solo en línea)',
    languages: 'Español, Inglés B2',
    responseTime: 'Responde en menos de 30 min',
    totalClasses: '250+ clases impartidas',
    reviewList: [
      { name: 'Luisa Moreno', img: 'https://randomuser.me/api/portraits/women/58.jpg', date: 'Hace 3 días', stars: '★★★★★', text: 'Aprendí Python desde cero con Ana y ahora trabajo como desarrolladora junior. Cambió mi carrera.' },
      { name: 'Felipe Ríos', img: 'https://randomuser.me/api/portraits/men/67.jpg', date: 'Hace 2 semanas', stars: '★★★★★', text: 'La mejor profesora de programación, explica muy bien y siempre está disponible para resolver dudas.' },
    ],
  },
  4: {
    name: 'Diego Ramírez',
    img: 'https://randomuser.me/api/portraits/men/76.jpg',
    subject: '🎸 Guitarra · Piano',
    rating: 4.7,
    reviews: 53,
    price: 18,
    modalities: ['En línea', 'Presencial'],
    bio: 'Músico profesional egresado del Conservatorio de Música. Enseño guitarra y piano para todos los niveles: desde principiantes absolutos hasta estudiantes que quieren prepararse para audiciones o exámenes musicales.',
    experience: [
      'Conservatorio de Música de Barranquilla — Guitarra clásica',
      'Especialización en teoría musical y armonía',
      'Experiencia en géneros: clásico, pop, rock, jazz y vallenato',
      'Más de 150 estudiantes formados en guitarra y piano',
    ],
    location: 'Barranquilla, Colombia',
    languages: 'Español',
    responseTime: 'Responde en menos de 3 horas',
    totalClasses: '200+ clases impartidas',
    reviewList: [
      { name: 'Camilo Díaz', img: 'https://randomuser.me/api/portraits/men/38.jpg', date: 'Hace 1 mes', stars: '★★★★★', text: 'Empecé desde cero y en 4 meses ya toco mis canciones favoritas. Diego tiene mucha paciencia.' },
    ],
  },
  5: {
    name: 'Sofía Herrera',
    img: 'https://randomuser.me/api/portraits/women/28.jpg',
    subject: '🔬 Química · Física',
    rating: 4.9,
    reviews: 87,
    price: 22,
    modalities: ['Presencial'],
    bio: 'Doctora en Química Orgánica con amplia experiencia preparando estudiantes para exámenes nacionales, universitarios y olimpiadas de química y física. Me apasiona transformar materias difíciles en algo entendible.',
    experience: [
      'Doctorado en Química Orgánica — Universidad de Antioquia',
      'Docente universitaria por 4 años',
      'Preparación para ICFES, ingreso a universidades y olimpiadas',
      'Especialista en laboratorio virtual y experimentos prácticos',
    ],
    location: 'Barranquilla, Colombia (presencial)',
    languages: 'Español',
    responseTime: 'Responde en menos de 2 horas',
    totalClasses: '350+ clases impartidas',
    reviewList: [
      { name: 'María Fernanda', img: 'https://randomuser.me/api/portraits/women/42.jpg', date: 'Hace 1 semana', stars: '★★★★★', text: 'Sofía es extraordinaria. Me preparó para la olimpiada de química y quedé entre los primeros puestos.' },
      { name: 'Daniel Castro', img: 'https://randomuser.me/api/portraits/men/49.jpg', date: 'Hace 1 mes', stars: '★★★★★', text: 'Súper didáctica y paciente. Logré aprobar química que había perdido el semestre anterior.' },
    ],
  },
  6: {
    name: 'Mateo Vargas',
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    subject: '📖 Historia · Arte',
    rating: 4.6,
    reviews: 41,
    price: 15,
    modalities: ['En línea'],
    bio: 'Licenciado en Humanidades con enfoque en historia latinoamericana e historia del arte. Mis clases combinan análisis crítico, fuentes primarias y contexto cultural para hacer la historia una experiencia viva.',
    experience: [
      'Licenciado en Humanidades — Universidad del Atlántico',
      'Especialización en Historia del Arte Contemporáneo',
      'Preparación para ICFES ciencias sociales y humanidades',
      'Clases de apreciación artística y análisis de obras',
    ],
    location: 'Barranquilla (solo en línea)',
    languages: 'Español',
    responseTime: 'Responde en menos de 4 horas',
    totalClasses: '120+ clases impartidas',
    reviewList: [
      { name: 'Isabela Mora', img: 'https://randomuser.me/api/portraits/women/72.jpg', date: 'Hace 2 semanas', stars: '★★★★★', text: 'Mateo hace que la historia sea fascinante. Sus clases son muy dinámicas y el contexto que da es increíble.' },
    ],
  },
  7: {
    name: 'Andrés Ospina',
    img: 'https://randomuser.me/api/portraits/men/12.jpg',
    subject: '📐 Matemáticas · Estadística',
    rating: 4.8,
    reviews: 112,
    price: 28,
    modalities: ['En línea', 'Presencial'],
    bio: 'Magíster en Matemáticas Aplicadas con especialización en estadística y análisis de datos. Llevo 6 años ayudando a estudiantes universitarios a dominar cálculo, álgebra lineal y estadística.',
    experience: [
      'Maestría en Matemáticas Aplicadas — Universidad Nacional',
      'Especialización en Estadística y Análisis de Datos',
      'Tutor en cursos de ingeniería, economía y administración',
      'Más de 400 estudiantes universitarios atendidos',
    ],
    location: 'Barranquilla, Colombia',
    languages: 'Español, Inglés B1',
    responseTime: 'Responde en menos de 1 hora',
    totalClasses: '450+ clases impartidas',
    reviewList: [
      { name: 'Santiago Reyes', img: 'https://randomuser.me/api/portraits/men/83.jpg', date: 'Hace 4 días', stars: '★★★★★', text: 'Andrés me salvó el semestre en estadística. Explica con ejemplos muy claros y es muy puntual.' },
      { name: 'Natalia Cruz', img: 'https://randomuser.me/api/portraits/women/90.jpg', date: 'Hace 3 semanas', stars: '★★★★★', text: 'Es un tutor excelente. Me preparó para el parcial de cálculo diferencial y saqué 4.5.' },
    ],
  },
  8: {
    name: 'Valeria Luna',
    img: 'https://randomuser.me/api/portraits/women/80.jpg',
    subject: '🌐 Inglés · Español',
    rating: 4.5,
    reviews: 33,
    price: 16,
    modalities: ['En línea'],
    bio: 'Bilingüe nativa con amplia experiencia enseñando inglés a niños, adolescentes y adultos profesionales. Me especializo en inglés conversacional, pronunciación y preparación para entrevistas laborales en inglés.',
    experience: [
      'Licenciada en Idiomas — Universidad Simón Bolívar',
      'Certificación TEFL — Teaching English as a Foreign Language',
      'Experiencia con niños desde 6 años hasta adultos',
      'Especialista en inglés para negocios e inglés conversacional',
    ],
    location: 'Barranquilla (solo en línea)',
    languages: 'Español nativo, Inglés C1',
    responseTime: 'Responde en menos de 2 horas',
    totalClasses: '100+ clases impartidas',
    reviewList: [
      { name: 'Camila Herrera', img: 'https://randomuser.me/api/portraits/women/33.jpg', date: 'Hace 1 semana', stars: '★★★★★', text: 'Valeria es muy paciente y sus clases son muy amenas. Mi pronunciación mejoró muchísimo.' },
    ],
  },
};

function initProfile() {

  // Leer el id de la URL (?id=1)
  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id') || '1';
  const tutor   = TUTORS[id];

  if (!tutor) {
    document.getElementById('profileName').textContent = 'Tutor no encontrado';
    return;
  }

  // — — Llenar datos del perfil — —
  document.title = `${tutor.name} — myTEACHER`;
  document.getElementById('profileImg').src           = tutor.img;
  document.getElementById('profileImg').alt           = tutor.name;
  document.getElementById('profileName').textContent  = tutor.name;
  document.getElementById('profileSubject').textContent = tutor.subject;
  document.getElementById('profileBio').textContent   = tutor.bio;
  document.getElementById('quickLocation').textContent  = tutor.location;
  document.getElementById('quickLanguages').textContent = tutor.languages;
  document.getElementById('quickResponse').textContent  = tutor.responseTime;
  document.getElementById('quickClasses').textContent   = tutor.totalClasses;
  document.getElementById('bookingPrice').textContent   = `$${tutor.price}`;
  document.getElementById('summaryPrice').textContent   = `$${tutor.price}`;

  // Estrellas y rating
  const fullStars = Math.floor(tutor.rating);
  const stars = '★'.repeat(fullStars) + (tutor.rating % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(tutor.rating));
  document.getElementById('profileStars').textContent   = stars;
  document.getElementById('profileRating').textContent  = tutor.rating.toFixed(1);
  document.getElementById('profileReviews').textContent = `(${tutor.reviews} reseñas)`;

  // Badges de modalidad
  const badgesEl = document.getElementById('profileBadges');
  tutor.modalities.forEach(m => {
    const span = document.createElement('span');
    span.className = 'badge';
    span.textContent = m;
    badgesEl.appendChild(span);
  });

  // Select de modalidad en la reserva
  const modalitySelect = document.getElementById('bookingModality');
  tutor.modalities.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    modalitySelect.appendChild(opt);
  });

  // Experiencia
  const expList = document.getElementById('profileExperience');
  tutor.experience.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    expList.appendChild(li);
  });

  // Reseñas
  const reviewsEl = document.getElementById('reviewsList');
  tutor.reviewList.forEach(r => {
    reviewsEl.innerHTML += `
      <div class="review-item">
        <div class="review-header">
          <img src="${r.img}" alt="${r.name}"/>
          <div class="review-author">
            <strong>${r.name}</strong>
            <span>${r.date}</span>
          </div>
          <span class="review-stars">${r.stars}</span>
        </div>
        <p class="review-text">${r.text}</p>
      </div>`;
  });

  // — — Selección de hora — —
  let selectedTime = null;

  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.dataset.time;
      updateSummary();
    });
  });

  // — — Actualizar resumen de precio — —
  function updateSummary() {
    const summary = document.getElementById('bookingSummary');
    const date    = document.getElementById('bookingDate').value;
    if (selectedTime && date) {
      summary.style.display = 'block';
      document.getElementById('summaryTotal').textContent = `$${tutor.price}`;
    }
  }

  document.getElementById('bookingDate')?.addEventListener('change', updateSummary);

  // — — Botón de reserva — —
  document.getElementById('bookingBtn').addEventListener('click', () => {
    const modality = document.getElementById('bookingModality').value;
    const date     = document.getElementById('bookingDate').value;

    if (!modality) { alert('Selecciona una modalidad.'); return; }
    if (!date)     { alert('Selecciona una fecha.'); return; }
    if (!selectedTime) { alert('Selecciona un horario.'); return; }

    // Formatear fecha legible
    const dateObj   = new Date(date + 'T00:00:00');
    const dateLabel = dateObj.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

    // Mostrar modal de confirmación
    document.getElementById('modalText').textContent =
      `Tu sesión con ${tutor.name} ha sido agendada para el ${dateLabel} a las ${selectedTime} (${modality}). Recibirás un correo de confirmación.`;
    document.getElementById('modalOverlay').style.display = 'flex';
  });

  // Cerrar modal
  document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('modalOverlay').style.display = 'none';
  });

  // Fecha mínima = hoy
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('bookingDate').min = today;
}