/* =============================================
   myTEACHER — auth.js
   Funcionalidades:
   1. Detecta si estamos en login o register
   2. Login: validación + simulación de acceso
   3. Register: validación, fortaleza de contraseña,
      tabs de rol (estudiante/tutor)
   4. Mostrar/ocultar contraseña
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ——————————————————————————————————————————
     UTILIDADES COMPARTIDAS
  —————————————————————————————————————————— */

  // Muestra un error en un campo
  function showError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  input.classList.add('input-error');
    if (error)  error.textContent = msg;
  }

  // Limpia el error de un campo
  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input)  { input.classList.remove('input-error'); input.classList.remove('input-ok'); }
    if (error)  error.textContent = '';
  }

  // Marca un campo como válido (borde verde)
  function markOk(inputId) {
    const input = document.getElementById(inputId);
    if (input) { input.classList.remove('input-error'); input.classList.add('input-ok'); }
  }

  // Validar email con expresión regular
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ——————————————————————————————————————————
     MOSTRAR / OCULTAR CONTRASEÑA
     Busca todos los botones .toggle-pass en la página
  —————————————————————————————————————————— */
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      // El input está en el mismo .input-icon-wrap
      const input = btn.closest('.input-icon-wrap').querySelector('input');
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? '🙈' : '👁';
    });
  });


  /* ══════════════════════════════════════════
     LOGIN
  ══════════════════════════════════════════ */
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {

    // Validación en tiempo real al escribir
    document.getElementById('email')?.addEventListener('input', function () {
      clearError('email', 'emailError');
      if (this.value && isValidEmail(this.value)) markOk('email');
    });
    document.getElementById('password')?.addEventListener('input', function () {
      clearError('password', 'passwordError');
      if (this.value.length >= 8) markOk('password');
    });

    loginBtn.addEventListener('click', () => {
      // Ocultar error global previo
      const loginError = document.getElementById('loginError');
      loginError.style.display = 'none';

      // Limpiar errores anteriores
      clearError('email',    'emailError');
      clearError('password', 'passwordError');

      const email    = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      let valid      = true;

      // Validar email
      if (!email) {
        showError('email', 'emailError', 'El correo es obligatorio.');
        valid = false;
      } else if (!isValidEmail(email)) {
        showError('email', 'emailError', 'Ingresa un correo válido.');
        valid = false;
      }

      // Validar contraseña
      if (!password) {
        showError('password', 'passwordError', 'La contraseña es obligatoria.');
        valid = false;
      } else if (password.length < 8) {
        showError('password', 'passwordError', 'Mínimo 8 caracteres.');
        valid = false;
      }

      if (!valid) return;

      // Simular carga
      loginBtn.textContent = 'Ingresando...';
      loginBtn.disabled    = true;

      setTimeout(() => {
        /* ——— AQUÍ iría la llamada real a tu API ———
          fetch('/api/login', { method: 'POST', body: JSON.stringify({email, password}) })
        */

        // DEMO: estudiante
        if (email === 'demo@myteacher.com' && password === '12345678') {
         window.location.href = '../pages/dashboard-student.html';

        // DEMO: tutor
        } else if (email === 'tutor@myteacher.com' && password === '12345678') {
          window.location.href = '../pages/dashboard-tutor.html';

        } else {
        // Error de credenciales
         loginError.style.display = 'flex';
        loginBtn.textContent     = 'Iniciar sesión';
        loginBtn.disabled        = false;
  }

}, 1200);
    });

    // "¿Olvidaste tu contraseña?" — simulación
    document.getElementById('forgotLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      if (!email || !isValidEmail(email)) {
        showError('email', 'emailError', 'Ingresa primero tu correo para recuperar la contraseña.');
      } else {
        alert(`Se envió un enlace de recuperación a: ${email}`);
      }
    });
  }


  /* ══════════════════════════════════════════
     REGISTER
  ══════════════════════════════════════════ */
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {

    /* — — Tabs de rol (Estudiante / Tutor) — — */
    const roleTabs    = document.querySelectorAll('.role-tab');
    const fieldSubject = document.getElementById('fieldSubject');
    const regTitle    = document.getElementById('registerTitle');
    const regSubtitle = document.getElementById('registerSubtitle');
    let currentRole   = 'student';

    roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentRole = tab.dataset.role;

        if (currentRole === 'tutor') {
          fieldSubject.style.display = 'block';
          regTitle.textContent       = 'Conviértete en tutor';
          regSubtitle.textContent    = 'Comparte tu conocimiento y empieza a ganar';
        } else {
          fieldSubject.style.display = 'none';
          regTitle.textContent       = 'Crea tu cuenta';
          regSubtitle.textContent    = 'Empieza a aprender hoy mismo, es gratis';
        }
      });
    });


    /* — — Fortaleza de contraseña — — */
    document.getElementById('password')?.addEventListener('input', function () {
      clearError('password', 'passwordError');
      calcStrength(this.value);
    });

    function calcStrength(pass) {
      const fill  = document.getElementById('strengthFill');
      const label = document.getElementById('strengthLabel');
      if (!fill || !label) return;

      let score = 0;
      if (pass.length >= 8)              score++;
      if (pass.length >= 12)             score++;
      if (/[A-Z]/.test(pass))            score++;
      if (/[0-9]/.test(pass))            score++;
      if (/[^A-Za-z0-9]/.test(pass))    score++;

      const levels = [
        { width: '0%',   color: '#e0e0e0', text: '' },
        { width: '25%',  color: '#e74c3c', text: 'Muy débil' },
        { width: '50%',  color: '#f39c12', text: 'Débil' },
        { width: '75%',  color: '#f5a623', text: 'Buena' },
        { width: '88%',  color: '#27ae60', text: 'Fuerte' },
        { width: '100%', color: '#1a9e5e', text: '¡Excelente!' },
      ];

      const lvl = pass.length === 0 ? levels[0] : levels[Math.min(score, 5)];
      fill.style.width      = lvl.width;
      fill.style.background = lvl.color;
      label.textContent     = lvl.text;
      label.style.color     = lvl.color;
    }


    /* — — Validación en tiempo real — — */
    document.getElementById('email')?.addEventListener('input', function () {
      clearError('email', 'emailError');
      if (this.value && isValidEmail(this.value)) markOk('email');
    });

    document.getElementById('name')?.addEventListener('input', function () {
      clearError('name', 'nameError');
      if (this.value.trim().length >= 2) markOk('name');
    });

    document.getElementById('confirm')?.addEventListener('input', function () {
      clearError('confirm', 'confirmError');
      const pass = document.getElementById('password')?.value;
      if (this.value && this.value === pass) markOk('confirm');
    });


    /* — — Envío del formulario — — */
    registerBtn.addEventListener('click', () => {
      // Limpiar todos los errores
      ['name','email','password','confirm','subject','terms'].forEach(id => {
        clearError(id, id + 'Error');
      });

      const name     = document.getElementById('name')?.value.trim();
      const email    = document.getElementById('email')?.value.trim();
      const password = document.getElementById('password')?.value;
      const confirm  = document.getElementById('confirm')?.value;
      const subject  = document.getElementById('subject')?.value;
      const terms    = document.getElementById('terms')?.checked;
      let valid      = true;

      if (!name || name.length < 2) {
        showError('name', 'nameError', 'Ingresa tu nombre completo.');
        valid = false;
      }

      if (!email) {
        showError('email', 'emailError', 'El correo es obligatorio.');
        valid = false;
      } else if (!isValidEmail(email)) {
        showError('email', 'emailError', 'Ingresa un correo válido.');
        valid = false;
      }

      if (!password || password.length < 8) {
        showError('password', 'passwordError', 'Mínimo 8 caracteres.');
        valid = false;
      }

      if (password !== confirm) {
        showError('confirm', 'confirmError', 'Las contraseñas no coinciden.');
        valid = false;
      }

      if (currentRole === 'tutor' && !subject) {
        showError('subject', 'subjectError', 'Selecciona una materia.');
        valid = false;
      }

      if (!terms) {
        const termsError = document.getElementById('termsError');
        if (termsError) termsError.textContent = 'Debes aceptar los términos para continuar.';
        valid = false;
      }

      if (!valid) return;

      // Simular carga
      registerBtn.textContent = 'Creando cuenta...';
      registerBtn.disabled    = true;

      setTimeout(() => {
        /* ——— AQUÍ iría la llamada real a tu API ———
           fetch('/api/register', { method: 'POST', body: JSON.stringify({name, email, password, role: currentRole}) })
        */

        // DEMO: registro exitoso → redirigir al login
        alert(`¡Cuenta creada exitosamente! Bienvenido/a, ${name}.`);
        window.location.href = 'login.html';
      }, 1400);
    });
  }

}); // fin DOMContentLoaded