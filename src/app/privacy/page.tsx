import Link from "next/link";

export const metadata = {
  title: "Aviso de Privacidad — StudyFlow AI",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="px-6 h-14 flex items-center border-b border-border">
        <Link
          href="/"
          className="text-[15px] font-serif font-medium text-foreground tracking-tight hover:opacity-80 transition-opacity duration-150"
        >
          StudyFlow AI
        </Link>
      </header>

      <main className="flex-1 px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-foreground-muted mb-4 font-sans">
            Legal
          </p>
          <h1 className="font-serif text-4xl font-medium text-foreground mb-3">
            Aviso de Privacidad
          </h1>
          <p className="text-[13px] text-foreground-muted font-sans mb-12">
            Última actualización: 20 de junio de 2026
          </p>

          <div className="space-y-10 text-[14px] text-foreground leading-relaxed font-sans">

            <p className="text-foreground-muted leading-relaxed">
              Este Aviso de Privacidad explica cómo StudyFlow AI recopila, usa, almacena, procesa, comparte y protege los datos personales de los usuarios que acceden o utilizan nuestro sitio web, aplicación, plataforma, herramientas de inteligencia artificial y servicios relacionados.
            </p>
            <p className="text-foreground-muted leading-relaxed">
              Al usar StudyFlow AI, aceptas el tratamiento de tus datos personales conforme a este Aviso de Privacidad.
            </p>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                1. Responsable del tratamiento de datos personales
              </h2>
              <ul className="space-y-1 text-foreground-muted pl-1">
                <li><span className="text-foreground font-medium">Responsable:</span> Benjamin Conde Ramos</li>
                <li><span className="text-foreground font-medium">Nombre comercial:</span> StudyFlow AI</li>
                <li><span className="text-foreground font-medium">Domicilio:</span> Playa Del Carmen, Quintana Roo, México</li>
                <li><span className="text-foreground font-medium">Correo de privacidad:</span> studyflowai122@gmail.com</li>
                <li><span className="text-foreground font-medium">País:</span> México</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                2. Resumen rápido
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI recopila y procesa datos para:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Crear y administrar cuentas.</li>
                <li>Permitir inicio de sesión.</li>
                <li>Crear sesiones de estudio.</li>
                <li>Generar contenido educativo con inteligencia artificial.</li>
                <li>Procesar documentos o PDFs si el usuario los sube.</li>
                <li>Guardar resúmenes, flashcards, quizzes, mensajes del tutor y progreso.</li>
                <li>Aplicar límites de uso.</li>
                <li>Prevenir abuso, bots, fraude y accesos no autorizados.</li>
                <li>Administrar planes, pagos o suscripciones si existen.</li>
                <li>Mejorar la seguridad y funcionamiento de la Plataforma.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                No vendemos tus datos personales. No debes subir datos sensibles, confidenciales o de terceros si no tienes autorización.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                Etiqueta de Privacidad de StudyFlow AI
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                Esta etiqueta resume los tipos de datos que StudyFlow AI puede recopilar.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">Categoría</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">Datos específicos</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">¿Vinculado al usuario?</th>
                      <th className="border border-border px-3 py-2 text-left font-semibold text-foreground">¿Publicidad?</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground-muted">
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Información de contacto</td>
                      <td className="border border-border px-3 py-2">Nombre, correo electrónico, nombre de usuario</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Identificadores</td>
                      <td className="border border-border px-3 py-2">ID de usuario, ID de sesión, tokens técnicos</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Datos de cuenta</td>
                      <td className="border border-border px-3 py-2">Fecha de registro, plan, estado de cuenta, configuración</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Contenido del usuario</td>
                      <td className="border border-border px-3 py-2">Temas, materias, objetivos, preguntas, mensajes, documentos, PDFs</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Contenido generado por IA</td>
                      <td className="border border-border px-3 py-2">Resúmenes, flashcards, quizzes, respuestas del tutor, soluciones matemáticas</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Datos de uso</td>
                      <td className="border border-border px-3 py-2">Funciones usadas, fecha de actividad, límites consumidos</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Datos técnicos</td>
                      <td className="border border-border px-3 py-2">Navegador, SO, tipo de dispositivo, idioma</td>
                      <td className="border border-border px-3 py-2">Puede estar vinculado</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Datos de red</td>
                      <td className="border border-border px-3 py-2">Dirección IP, ubicación aproximada, eventos de acceso</td>
                      <td className="border border-border px-3 py-2">Puede estar vinculado</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Datos de seguridad</td>
                      <td className="border border-border px-3 py-2">CAPTCHA, intentos de inicio de sesión, eventos sospechosos</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Datos de pago</td>
                      <td className="border border-border px-3 py-2">Plan, estado de suscripción, ID en proveedor de pago</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Datos financieros completos</td>
                      <td className="border border-border px-3 py-2">Número de tarjeta, CVV, datos bancarios</td>
                      <td className="border border-border px-3 py-2">No los almacenamos directamente</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Cookies</td>
                      <td className="border border-border px-3 py-2">Sesión, preferencias, tokens técnicos</td>
                      <td className="border border-border px-3 py-2">Sí</td>
                      <td className="border border-border px-3 py-2">No</td>
                    </tr>
                    <tr>
                      <td className="border border-border px-3 py-2 font-medium text-foreground">Ubicación precisa, biométricos, salud</td>
                      <td className="border border-border px-3 py-2">GPS, reconocimiento facial, datos médicos</td>
                      <td className="border border-border px-3 py-2">No aplica</td>
                      <td className="border border-border px-3 py-2">No recolectamos</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                3. Datos personales que recopilamos
              </h2>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.1 Datos de cuenta</h3>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-4">
                <li>Nombre.</li>
                <li>Correo electrónico.</li>
                <li>Contraseña cifrada o gestionada por proveedor de autenticación.</li>
                <li>ID de usuario.</li>
                <li>Fecha de creación de cuenta.</li>
                <li>Estado de cuenta.</li>
                <li>Plan asignado.</li>
                <li>Preferencias básicas.</li>
              </ol>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.2 Datos de autenticación y seguridad</h3>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-4">
                <li>Dirección IP.</li>
                <li>Intentos de inicio de sesión.</li>
                <li>Registros de sesión.</li>
                <li>CAPTCHA o verificación anti-bots.</li>
                <li>Eventos sospechosos.</li>
                <li>Fecha y hora de acceso.</li>
                <li>User agent o información del navegador.</li>
                <li>Tokens técnicos necesarios para mantener sesión.</li>
              </ol>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.3 Datos de estudio</h3>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-4">
                <li>Materias creadas.</li>
                <li>Títulos de sesiones.</li>
                <li>Temas de estudio.</li>
                <li>Objetivos de aprendizaje.</li>
                <li>Nivel seleccionado.</li>
                <li>Historial de sesiones.</li>
                <li>Progreso.</li>
                <li>Herramientas utilizadas.</li>
                <li>Flashcards generadas.</li>
                <li>Quizzes generados.</li>
                <li>Respuestas o intentos de quiz.</li>
                <li>Mensajes enviados al tutor IA.</li>
                <li>Problemas matemáticos ingresados.</li>
              </ol>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.4 Documentos y archivos</h3>
              <p className="text-foreground-muted leading-relaxed mb-2">
                Si usas funciones de carga de documentos, podemos recopilar: nombre del archivo, tipo y tamaño, fecha de carga, ruta de almacenamiento, texto extraído y contenido del documento. No debes subir documentos con datos sensibles, confidenciales, secretos, datos de terceros, contraseñas, claves API, información bancaria o expedientes médicos o legales.
              </p>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.5 Datos generados por IA</h3>
              <p className="text-foreground-muted leading-relaxed mb-2">
                Podemos almacenar resúmenes, flashcards, preguntas de quiz, respuestas del tutor IA, soluciones matemáticas, recomendaciones de estudio e historial de generación.
              </p>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.6 Datos de uso y rendimiento</h3>
              <p className="text-foreground-muted leading-relaxed mb-2">
                Podemos recopilar: funciones utilizadas, número de generaciones de IA, límites consumidos, tiempo de uso estimado, páginas visitadas, errores técnicos, tiempos de respuesta, logs de diagnóstico y eventos de seguridad.
              </p>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.7 Datos de pago</h3>
              <p className="text-foreground-muted leading-relaxed mb-2">
                Si StudyFlow AI ofrece planes de pago, podemos recopilar: plan contratado, estado de suscripción, fechas de inicio y renovación, historial de pagos e ID de cliente en el proveedor de pagos. No almacenamos directamente el número completo de tarjeta, CVV ni datos bancarios completos.
              </p>

              <h3 className="font-serif text-base font-medium text-foreground mb-2 mt-5">3.8 Comunicaciones</h3>
              <p className="text-foreground-muted leading-relaxed">
                Si nos contactas, podemos recopilar: nombre, correo electrónico, mensaje enviado, archivos adjuntos, historial de soporte y respuestas a formularios o encuestas.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                4. Finalidades del tratamiento
              </h2>

              <h3 className="font-serif text-base font-medium text-foreground mb-2">4.1 Finalidades necesarias</h3>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-4">
                <li>Crear y administrar tu cuenta.</li>
                <li>Verificar tu identidad.</li>
                <li>Permitir inicio de sesión y mantener tu sesión activa.</li>
                <li>Crear sesiones de estudio, materias y objetivos.</li>
                <li>Generar contenido con inteligencia artificial.</li>
                <li>Guardar resúmenes, flashcards, quizzes y respuestas.</li>
                <li>Procesar documentos o archivos.</li>
                <li>Mostrar historial y progreso.</li>
                <li>Aplicar límites de uso.</li>
                <li>Administrar planes y suscripciones.</li>
                <li>Procesar pagos.</li>
                <li>Prevenir bots, abuso, fraude y accesos no autorizados.</li>
                <li>Proteger la seguridad de la Plataforma.</li>
                <li>Dar soporte técnico y corregir errores.</li>
                <li>Cumplir obligaciones legales y resolver disputas.</li>
              </ol>

              <h3 className="font-serif text-base font-medium text-foreground mb-2">4.2 Finalidades secundarias</h3>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Mejorar la experiencia de usuario.</li>
                <li>Analizar uso general de la Plataforma.</li>
                <li>Desarrollar nuevas funciones.</li>
                <li>Realizar métricas internas.</li>
                <li>Enviar comunicaciones sobre actualizaciones o nuevas funciones.</li>
                <li>Enviar encuestas opcionales.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Puedes solicitar limitar el uso de tus datos para finalidades secundarias escribiendo a: studyflowai122@gmail.com
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                5. Uso de inteligencia artificial
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI usa modelos de inteligencia artificial para generar contenido educativo. Para ello, podemos procesar o enviar a proveedores externos de IA la información necesaria, incluyendo: título de la sesión, materia, objetivo, nivel, instrucciones del usuario, preguntas, fragmentos de documentos, texto extraído de PDFs, resúmenes previos e historial mínimo necesario para responder en contexto.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Intentamos limitar la información enviada a lo necesario para prestar el Servicio. No debes ingresar información sensible, confidencial o de terceros si no tienes autorización.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                6. Proveedores externos
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Podemos compartir o procesar datos mediante proveedores que ayudan a operar StudyFlow AI, incluyendo: proveedores de hosting, bases de datos, autenticación, almacenamiento de archivos, proveedores de inteligencia artificial, procesadores de pago, servicios de CAPTCHA, servicios de correo electrónico, herramientas de analytics y monitoreo de errores.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Estos proveedores pueden operar en México, Estados Unidos u otros países. Intentamos elegir proveedores con medidas razonables de seguridad, pero no controlamos completamente sus sistemas, políticas o cambios.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                7. Servicios externos que podemos utilizar
              </h2>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Supabase, para autenticación, base de datos y almacenamiento.</li>
                <li>OpenAI u otros proveedores de IA, para generación de contenido.</li>
                <li>Vercel u otros proveedores de hosting.</li>
                <li>hCaptcha u otros sistemas anti-bots.</li>
                <li>Stripe, PayPal, Mercado Pago u otros procesadores de pago.</li>
                <li>Google Analytics, PostHog, Plausible u otras herramientas de analítica, si se implementan.</li>
                <li>Proveedores de email transaccional.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                La lista exacta puede cambiar conforme evolucione la Plataforma.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                8. Transferencias de datos
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Podemos transferir datos personales cuando sea necesario para prestar el Servicio, procesar contenido con IA, almacenar información, procesar pagos, proteger la seguridad, cumplir obligaciones legales o resolver disputas.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Al usar StudyFlow AI, aceptas que tus datos puedan ser procesados por proveedores externos necesarios para operar la Plataforma.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                9. Transferencias internacionales
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Algunos proveedores pueden estar ubicados fuera de México. Por ello, tus datos pueden ser tratados, almacenados o procesados en otros países. Al usar StudyFlow AI, aceptas que tus datos puedan ser transferidos internacionalmente cuando sea necesario para prestar el Servicio, procesar IA, alojar la Plataforma, proteger la seguridad, procesar pagos o cumplir obligaciones legales.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                10. Cookies y tecnologías similares
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Podemos usar cookies, almacenamiento local y tecnologías similares para:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Mantener tu sesión iniciada.</li>
                <li>Recordar preferencias.</li>
                <li>Proteger la seguridad.</li>
                <li>Detectar bots.</li>
                <li>Aplicar límites.</li>
                <li>Medir uso de la Plataforma.</li>
                <li>Mejorar rendimiento y diagnosticar errores.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Puedes controlar ciertas cookies desde tu navegador. Sin embargo, bloquear cookies esenciales puede afectar el funcionamiento de StudyFlow AI.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                11. Conservación de datos
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Conservaremos tus datos durante el tiempo necesario para prestar el Servicio, cumplir obligaciones legales, resolver disputas, prevenir fraude, mantener seguridad y hacer cumplir nuestros Términos. De forma general:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Datos de cuenta: mientras la cuenta esté activa.</li>
                <li>Contenido de estudio: mientras el usuario mantenga la cuenta o hasta que lo elimine.</li>
                <li>Documentos: mientras estén asociados a la cuenta o hasta que el usuario los elimine.</li>
                <li>Logs de seguridad: durante el tiempo razonablemente necesario para prevenir abuso.</li>
                <li>Datos de pago: conforme a obligaciones contables, fiscales o legales.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Cuando los datos ya no sean necesarios, podrán eliminarse, anonimizarse o agregarse.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                12. Seguridad
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Aplicamos medidas razonables de seguridad administrativas, técnicas y organizativas para proteger tus datos, incluyendo: autenticación de usuarios, cifrado en tránsito, controles de acceso, reglas de seguridad por usuario, separación de datos por cuenta, protección contra bots, monitoreo de abuso, registros de seguridad, límites de uso y políticas de acceso en base de datos.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Ningún sistema es completamente seguro. No podemos garantizar seguridad absoluta.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                13. Derechos ARCO
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Conforme a la legislación aplicable, puedes ejercer tus derechos de:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li><span className="text-foreground font-medium">Acceso:</span> conocer qué datos personales tenemos sobre ti.</li>
                <li><span className="text-foreground font-medium">Rectificación:</span> corregir datos inexactos o incompletos.</li>
                <li><span className="text-foreground font-medium">Cancelación:</span> solicitar eliminación de datos cuando proceda.</li>
                <li><span className="text-foreground font-medium">Oposición:</span> oponerte a ciertos usos de tus datos.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed mb-3">
                También puedes solicitar la revocación del consentimiento cuando sea aplicable. Para ejercer estos derechos, envía una solicitud a: <span className="text-foreground font-medium">studyflowai122@gmail.com</span>
              </p>
              <p className="text-foreground-muted leading-relaxed mb-2">Tu solicitud debe incluir:</p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Nombre completo.</li>
                <li>Correo asociado a tu cuenta.</li>
                <li>Derecho que deseas ejercer.</li>
                <li>Descripción clara de tu solicitud.</li>
                <li>Documento para acreditar identidad, cuando sea necesario.</li>
                <li>Información que ayude a localizar tus datos.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Responderemos conforme a los plazos establecidos por la legislación aplicable.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                14. Eliminación de cuenta
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Puedes solicitar la eliminación de tu cuenta escribiendo a: <span className="text-foreground font-medium">studyflowai122@gmail.com</span>. Al eliminar tu cuenta, podemos borrar o anonimizar datos asociados, salvo aquellos que debamos conservar por motivos legales, fiscales, contables, de seguridad, prevención de fraude, resolución de disputas o cumplimiento de nuestros Términos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                15. Menores de edad
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI no está dirigido a menores de 13 años. Si eres menor de edad conforme a las leyes de tu país, debes usar StudyFlow AI con autorización de tu madre, padre, tutor legal o institución educativa autorizada.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Si detectamos que recopilamos datos de un menor de 13 años sin autorización válida, tomaremos medidas razonables para eliminar la información.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                16. Datos sensibles
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI no solicita datos personales sensibles. No debes subir información relacionada con:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Salud física o mental.</li>
                <li>Religión.</li>
                <li>Opiniones políticas.</li>
                <li>Orientación sexual.</li>
                <li>Datos biométricos.</li>
                <li>Información financiera sensible.</li>
                <li>Datos de menores sin autorización.</li>
                <li>Contraseñas, secretos, claves privadas o tokens.</li>
                <li>Expedientes confidenciales.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Si cargas ese tipo de información, lo haces bajo tu responsabilidad y declaras contar con autorización suficiente.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                17. Decisiones automatizadas
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI puede usar sistemas automatizados para: generar contenido educativo, aplicar límites de uso, detectar abuso, proteger contra bots, clasificar errores técnicos y recomendar materiales de estudio.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                No usamos decisiones automatizadas para tomar decisiones legales, financieras, médicas, laborales o de alto impacto sobre el usuario.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                18. No venta de datos
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI no vende tus datos personales. Si en el futuro cambiamos esta práctica, actualizaremos este Aviso de Privacidad y solicitaremos el consentimiento correspondiente cuando la ley lo requiera.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                19. Publicidad y rastreo
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Actualmente StudyFlow AI no usa datos personales para publicidad comportamental de terceros ni para rastrear usuarios entre apps o sitios de terceros con fines publicitarios. Si en el futuro implementamos publicidad, identificadores publicitarios o rastreo, actualizaremos este Aviso y la etiqueta de privacidad.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                20. Cambios al Aviso de Privacidad
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Podemos actualizar este Aviso de Privacidad por cambios legales, técnicos, operativos o comerciales. Cuando los cambios sean relevantes, intentaremos notificarte por correo electrónico, aviso dentro de la app o mensaje visible en el sitio.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                21. Contacto de privacidad
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Para preguntas, solicitudes o quejas relacionadas con privacidad, puedes contactarnos en:
              </p>
              <ul className="space-y-1 text-foreground-muted pl-1">
                <li><span className="text-foreground font-medium">Correo de privacidad:</span> studyflowai122@gmail.com</li>
                <li><span className="text-foreground font-medium">Responsable:</span> Benjamín Conde Ramos</li>
                <li><span className="text-foreground font-medium">Domicilio:</span> Playa Del Carmen, Quintana Roo, México</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="text-[13px] text-foreground-muted hover:text-foreground transition-colors duration-150 font-sans"
          >
            ← Volver al inicio
          </Link>
        </div>
      </footer>
    </div>
  );
}
