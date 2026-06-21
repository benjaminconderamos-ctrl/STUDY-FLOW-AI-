import Link from "next/link";

export const metadata = {
  title: "Términos de Servicio — StudyFlow AI",
};

export default function TermsPage() {
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
            Términos de Servicio
          </h1>
          <p className="text-[13px] text-foreground-muted font-sans mb-12">
            Última actualización: 20 de junio de 2026
          </p>

          <div className="space-y-10 text-[14px] text-foreground leading-relaxed font-sans">

            <p className="text-foreground-muted leading-relaxed">
              Bienvenido a StudyFlow AI. Estos Términos de Servicio regulan el acceso y uso de nuestro sitio web, aplicación, plataforma, herramientas de inteligencia artificial, servicios educativos, funciones de generación de contenido, almacenamiento de sesiones de estudio, carga de documentos, funciones de pago y cualquier otro servicio relacionado con StudyFlow AI.
            </p>
            <p className="text-foreground-muted leading-relaxed">
              {`Al crear una cuenta, acceder, navegar, usar la plataforma, cargar contenido, generar materiales con inteligencia artificial o hacer clic en "Acepto", declaras que has leído, entendido y aceptado estos Términos de Servicio.`}
            </p>
            <p className="text-foreground-muted leading-relaxed">
              Si no estás de acuerdo con estos Términos, no debes usar StudyFlow AI.
            </p>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                1. Identidad del proveedor
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI es operado por:
              </p>
              <ul className="space-y-1 text-foreground-muted pl-1">
                <li><span className="text-foreground font-medium">Responsable:</span> Benjamin Conde Ramos</li>
                <li><span className="text-foreground font-medium">Nombre comercial:</span> StudyFlow AI</li>
                <li><span className="text-foreground font-medium">Domicilio:</span> Playa Del Carmen, Quintana Roo, México</li>
                <li><span className="text-foreground font-medium">Correo de contacto:</span> studyflowai122@gmail.com</li>
                <li><span className="text-foreground font-medium">País:</span> México</li>
              </ul>
              <p className="text-foreground-muted leading-relaxed mt-3">
                {`En estos Términos, "StudyFlow AI", "nosotros", "nuestro", "la Plataforma" o "el Servicio" se refiere al proveedor de StudyFlow AI. "Usuario", "tú" o "tu" se refiere a cualquier persona que acceda o utilice StudyFlow AI.`}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                2. Descripción general del servicio
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI es una plataforma educativa que ayuda a los usuarios a estudiar, organizar información y generar materiales académicos mediante herramientas digitales e inteligencia artificial. Dependiendo de la versión, disponibilidad técnica y plan contratado, StudyFlow AI puede permitir:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted">
                <li>Crear sesiones de estudio.</li>
                <li>Crear materias, temas y objetivos de estudio.</li>
                <li>Generar resúmenes con inteligencia artificial.</li>
                <li>Generar flashcards o tarjetas de estudio.</li>
                <li>Generar quizzes, preguntas o evaluaciones de práctica.</li>
                <li>Usar un tutor educativo con inteligencia artificial.</li>
                <li>Resolver problemas matemáticos paso a paso.</li>
                <li>Subir documentos o archivos PDF para extraer información.</li>
                <li>Crear materiales de estudio a partir de documentos.</li>
                <li>Consultar progreso, actividad o historial de estudio.</li>
                <li>Acceder a planes gratuitos, beta, Pro, Max o de pago.</li>
                <li>Usar funciones experimentales, beta o en desarrollo.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed mt-3">
                Algunas funciones pueden estar limitadas, deshabilitadas, en fase beta, en mantenimiento, sujetas a disponibilidad o restringidas por plan. StudyFlow AI puede modificar, ampliar, reducir, suspender o eliminar funciones en cualquier momento, especialmente cuando sean funciones gratuitas, beta, experimentales o dependientes de proveedores externos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                3. Naturaleza educativa de StudyFlow AI
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI es una herramienta de apoyo educativo. No sustituye:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Profesores, tutores, instituciones educativas o asesoría profesional.</li>
                <li>La revisión humana de trabajos, tareas, exámenes o proyectos.</li>
                <li>El criterio propio del estudiante.</li>
                <li>La obligación del usuario de verificar información.</li>
                <li>Servicios profesionales legales, médicos, financieros, psicológicos, fiscales o especializados.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Los materiales generados por inteligencia artificial pueden contener errores, imprecisiones, omisiones, sesgos, explicaciones incompletas, referencias incorrectas o interpretaciones equivocadas. El usuario es responsable de revisar, validar y decidir cómo utiliza cualquier contenido generado por StudyFlow AI.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                4. Aceptación de los Términos
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Aceptas estos Términos cuando:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Creas una cuenta.</li>
                <li>Inicias sesión.</li>
                <li>Usas cualquier función de StudyFlow AI.</li>
                <li>Cargas documentos o información.</li>
                <li>Generas contenido mediante IA.</li>
                <li>Contratas o usas un plan de pago.</li>
                <li>Haces clic en un checkbox, botón o mensaje de aceptación.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Podemos solicitar que aceptes nuevamente estos Términos si hay cambios importantes.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                5. Requisitos de edad
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Para usar StudyFlow AI debes tener al menos 13 años de edad. Si eres menor de edad conforme a las leyes de tu país, debes usar StudyFlow AI únicamente con autorización de tu madre, padre, tutor legal o institución educativa autorizada.
              </p>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI no está dirigido intencionalmente a menores de 13 años. No recopilamos de forma intencional datos personales de menores de 13 años sin autorización válida. Si detectamos que una cuenta pertenece a una persona menor de 13 años sin autorización verificable, podremos suspender o eliminar la cuenta y sus datos asociados.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Si eres madre, padre o tutor legal y consideras que un menor de 13 años nos proporcionó datos personales, puedes contactarnos en: studyflowai122@gmail.com
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                6. Cuenta de usuario
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Para usar ciertas funciones, deberás crear una cuenta. Al crear una cuenta, declaras que:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>La información proporcionada es verdadera, completa y actual.</li>
                <li>Tienes capacidad legal para aceptar estos Términos.</li>
                <li>No estás usando la cuenta en nombre de otra persona sin autorización.</li>
                <li>Mantendrás actualizada tu información.</li>
                <li>No compartirás tus credenciales con terceros.</li>
                <li>Serás responsable de la actividad realizada desde tu cuenta.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Podemos rechazar, suspender o eliminar cuentas que contengan información falsa, infrinjan estos Términos, generen riesgos de seguridad o afecten el funcionamiento de StudyFlow AI.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                7. Seguridad de la cuenta
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Eres responsable de mantener la confidencialidad de tu contraseña y credenciales de acceso. Debes notificarnos si sospechas que tu cuenta fue comprometida o utilizada sin autorización. StudyFlow AI no será responsable por pérdidas derivadas de:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted">
                <li>Contraseñas débiles.</li>
                <li>Contraseñas reutilizadas.</li>
                <li>Acceso no autorizado causado por negligencia del usuario.</li>
                <li>Dispositivos comprometidos.</li>
                <li>Compartir la cuenta con terceros.</li>
                <li>Phishing o engaños externos a StudyFlow AI.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                8. Uso permitido
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Puedes usar StudyFlow AI con fines personales, educativos, académicos, de organización de estudio o aprendizaje. Salvo autorización expresa por escrito, no puedes usar StudyFlow AI para reventa, explotación comercial masiva, scraping, extracción automatizada o creación de servicios competidores.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                9. Uso prohibido
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                No puedes usar StudyFlow AI para:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Violar leyes, reglamentos o derechos de terceros.</li>
                <li>Cargar, generar o distribuir malware, virus, phishing, spam o contenido fraudulento.</li>
                <li>Intentar acceder sin autorización a cuentas, sistemas, servidores, bases de datos o infraestructura.</li>
                <li>Evadir límites de uso, medidas de seguridad, cuotas, CAPTCHA, validaciones o restricciones técnicas.</li>
                <li>Realizar scraping, automatización abusiva o extracción masiva.</li>
                <li>Usar endpoints, APIs internas o rutas no documentadas fuera de la interfaz autorizada.</li>
                <li>Interferir con el funcionamiento normal de la Plataforma.</li>
                <li>Cargar documentos que no tengas derecho a usar.</li>
                <li>Infringir derechos de autor, marcas, secretos comerciales o propiedad intelectual.</li>
                <li>Cargar datos personales sensibles de terceros sin autorización.</li>
                <li>Cargar contraseñas, claves API, tokens, secretos, datos bancarios o credenciales.</li>
                <li>Generar contenido de odio, acoso, violencia, explotación, abuso, autolesión o actividades ilegales.</li>
                <li>Usar la Plataforma para cometer fraude académico, plagio, suplantación o trampa.</li>
                <li>Revender, sublicenciar, clonar o explotar StudyFlow AI sin autorización.</li>
                <li>Hacer ingeniería inversa, copiar o reproducir la Plataforma.</li>
                <li>Usar el Servicio para entrenar modelos competidores sin autorización.</li>
                <li>Usar StudyFlow AI de forma que genere costos excesivos, daño reputacional o riesgos legales.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Podemos limitar, suspender o cancelar tu cuenta si detectamos uso prohibido.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                10. Conducta académica
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI está diseñado para ayudarte a estudiar y entender mejor los temas. No debe usarse para sustituir tu propio trabajo académico cuando las reglas de tu escuela, universidad o institución lo prohíban. El usuario acepta no usar StudyFlow AI para:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Presentar contenido generado por IA como propio si su institución lo prohíbe.</li>
                <li>Copiar respuestas sin entenderlas.</li>
                <li>Evadir evaluaciones, tareas, exámenes o mecanismos académicos.</li>
                <li>Suplantar a otra persona.</li>
                <li>Violar reglamentos escolares o universitarios.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI no será responsable por sanciones académicas, calificaciones, expulsiones, reportes disciplinarios o consecuencias derivadas del uso indebido del Servicio.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                11. Contenido del usuario
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                {`El "Contenido del Usuario" incluye cualquier información, texto, pregunta, tema, materia, objetivo, instrucción, documento, archivo, PDF, apunte, imagen, mensaje, problema matemático o dato que el usuario suba, escriba, envíe o genere dentro de StudyFlow AI.`}
              </p>
              <p className="text-foreground-muted leading-relaxed mb-3">
                El usuario conserva los derechos que tenga sobre su Contenido del Usuario. Al usar StudyFlow AI, otorgas a StudyFlow AI una licencia limitada, mundial, no exclusiva, revocable en la medida permitida por la funcionalidad del Servicio, libre de regalías y necesaria para alojar, almacenar, procesar, analizar, convertir, transmitir, mostrar y transformar tu Contenido del Usuario únicamente para operar, prestar, mantener, proteger y mejorar StudyFlow AI.
              </p>
              <p className="text-foreground-muted leading-relaxed mb-3">Esta licencia permite, por ejemplo:</p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Guardar tus sesiones de estudio.</li>
                <li>Procesar tus temas y documentos.</li>
                <li>Extraer texto de archivos.</li>
                <li>Enviar instrucciones o fragmentos a proveedores de IA.</li>
                <li>Generar resúmenes, flashcards, quizzes o respuestas.</li>
                <li>Mostrarte historial y progreso.</li>
                <li>Aplicar límites de uso.</li>
                <li>Detectar errores, abuso o problemas de seguridad.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">No vendemos tu Contenido del Usuario.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                12. Responsabilidad sobre el contenido del usuario
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Eres responsable de todo el Contenido del Usuario que subas, escribas o proceses en StudyFlow AI. Declaras y garantizas que:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Tienes derecho a usar el contenido que proporcionas.</li>
                <li>Tu contenido no infringe derechos de terceros.</li>
                <li>Tu contenido no viola leyes aplicables.</li>
                <li>Tu contenido no contiene datos personales de terceros sin autorización.</li>
                <li>Tu contenido no contiene información sensible o confidencial que no deba procesarse.</li>
                <li>Tu contenido no contiene malware, código dañino o archivos peligrosos.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Podemos eliminar, bloquear o restringir contenido que consideremos riesgoso, ilegal, abusivo o contrario a estos Términos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                13. Carga de documentos y archivos
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Si StudyFlow AI permite subir documentos, el usuario acepta que:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Solo subirá archivos que tenga derecho a usar.</li>
                <li>No subirá documentos con información confidencial de terceros sin autorización.</li>
                <li>No subirá datos personales sensibles salvo que tenga base legal suficiente.</li>
                <li>No subirá documentos con contraseñas, tokens, secretos o información bancaria.</li>
                <li>No subirá documentos ilegales, dañinos o que infrinjan derechos.</li>
                <li>StudyFlow AI podrá procesar, convertir, extraer texto y analizar dichos documentos para prestar el Servicio.</li>
                <li>StudyFlow AI podrá limitar tamaño, tipo, cantidad y frecuencia de carga.</li>
                <li>StudyFlow AI podrá rechazar archivos por razones técnicas, legales o de seguridad.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI no garantiza que la extracción de texto de PDFs o documentos sea perfecta. Algunos archivos pueden no procesarse correctamente, especialmente si están escaneados, dañados, protegidos por contraseña, contienen imágenes sin texto o tienen formato incompatible.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                14. Contenido generado por inteligencia artificial
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI puede generar contenido mediante modelos de inteligencia artificial, incluyendo: resúmenes, explicaciones, flashcards, preguntas de quiz, respuestas del tutor IA, soluciones matemáticas, planes de estudio, recomendaciones de repaso y clasificaciones de contenido.
              </p>
              <p className="text-foreground-muted leading-relaxed mb-3">El usuario entiende que el contenido generado por IA:</p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Puede ser incorrecto, incompleto o impreciso.</li>
                <li>Puede contener errores matemáticos, conceptuales o de interpretación.</li>
                <li>Puede no estar actualizado.</li>
                <li>Puede no coincidir con el criterio de un profesor o institución.</li>
                <li>Puede no ser suficiente para aprobar un examen o tarea.</li>
                <li>Puede generar resultados similares para usuarios diferentes.</li>
                <li>Puede depender de la calidad del contenido proporcionado por el usuario.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI no garantiza la exactitud, completitud, utilidad, originalidad, disponibilidad o idoneidad del contenido generado por IA. El usuario es responsable de revisar y verificar cualquier resultado antes de usarlo.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                15. Uso de proveedores externos de inteligencia artificial
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Para prestar funciones de inteligencia artificial, StudyFlow AI puede enviar datos, instrucciones, temas, fragmentos de documentos, preguntas, respuestas, mensajes o contexto a proveedores externos de IA. Estos proveedores pueden procesar la información conforme a sus propias políticas, configuraciones, términos empresariales, medidas de seguridad y condiciones aplicables.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Intentaremos limitar la información enviada a lo necesario para prestar el Servicio. Sin embargo, el usuario acepta que ciertos datos proporcionados a StudyFlow AI pueden ser procesados por proveedores externos para generar los resultados solicitados. No debes subir información confidencial, sensible o de terceros si no tienes autorización para su procesamiento mediante proveedores externos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                16. No asesoría profesional
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI no proporciona asesoría profesional legal, médica, psicológica, financiera, fiscal, contable, de inversión, migratoria, técnica especializada o de seguridad crítica. Cualquier contenido generado por StudyFlow AI debe considerarse información educativa o de apoyo general. Si necesitas asesoría profesional, debes consultar a un especialista calificado.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                17. Funciones de matemáticas
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                El resolvedor de matemáticas de StudyFlow AI está diseñado para explicar procedimientos y ayudar al aprendizaje. No garantizamos que:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Todos los procedimientos sean correctos.</li>
                <li>La respuesta final sea exacta.</li>
                <li>La explicación coincida con el método exigido por tu profesor.</li>
                <li>La IA detecte todos los errores en el planteamiento.</li>
                <li>La solución sea válida para todos los contextos.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">El usuario debe revisar y comprobar los resultados.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                18. Planes, límites y cuotas
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI puede ofrecer planes gratuitos, beta, Pro, Max, institucionales o de pago. Cada plan puede incluir límites sobre: número de resúmenes, flashcards, quizzes, mensajes al tutor IA, uso del resolvedor matemático, documentos cargados, tamaño de archivos, almacenamiento, historial, funciones avanzadas, prioridad de procesamiento y acceso a funciones beta.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Podemos aplicar límites diarios, semanales, mensuales, por cuenta, por usuario, por IP, por dispositivo o por plan. Intentar evadir límites, crear cuentas múltiples abusivas o manipular el sistema de cuotas puede resultar en suspensión o cancelación de la cuenta.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                19. Planes de pago, suscripciones y facturación
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Si StudyFlow AI ofrece planes de pago, el usuario acepta pagar las tarifas correspondientes al plan seleccionado. Las suscripciones pueden renovarse automáticamente salvo que el usuario las cancele antes de la fecha de renovación.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Los pagos pueden ser procesados por proveedores externos. StudyFlow AI no necesariamente almacena números completos de tarjeta, CVV o datos bancarios completos. El usuario es responsable de mantener actualizado su método de pago. Podemos modificar precios, beneficios o límites de los planes. Cuando sea legalmente necesario, se notificará al usuario antes de aplicar cambios materiales a planes ya contratados.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                20. Reembolsos
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Salvo que la ley aplicable establezca lo contrario, los pagos realizados a StudyFlow AI pueden ser no reembolsables. Podremos otorgar reembolsos, créditos o extensiones de servicio a nuestra discreción, especialmente en casos de errores técnicos graves atribuibles a StudyFlow AI. No se otorgarán reembolsos por:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted">
                <li>Falta de uso del Servicio.</li>
                <li>Uso parcial del plan.</li>
                <li>Expectativas subjetivas no cumplidas.</li>
                <li>Resultados generados por IA que no gusten al usuario.</li>
                <li>Suspensión por incumplimiento de estos Términos.</li>
                <li>Errores derivados de información incorrecta proporcionada por el usuario.</li>
                <li>Interrupciones causadas por terceros fuera de nuestro control razonable.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                21. Funciones beta o experimentales
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI puede ofrecer funciones beta, experimentales o en desarrollo. Estas funciones pueden:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Contener errores.</li>
                <li>Cambiar sin previo aviso.</li>
                <li>Ser eliminadas.</li>
                <li>Generar resultados incompletos.</li>
                <li>Tener límites especiales.</li>
                <li>No estar disponibles para todos los usuarios.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">El uso de funciones beta es bajo responsabilidad del usuario.</p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                22. Disponibilidad del Servicio
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Intentaremos mantener StudyFlow AI disponible de forma razonable, pero no garantizamos disponibilidad continua, ininterrumpida, segura o libre de errores. El Servicio puede verse afectado por:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Mantenimiento.</li>
                <li>Actualizaciones.</li>
                <li>Fallas técnicas.</li>
                <li>Ataques, abuso o incidentes de seguridad.</li>
                <li>Errores de proveedores externos.</li>
                <li>Problemas de red.</li>
                <li>Cambios regulatorios.</li>
                <li>Eventos fuera de nuestro control.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI no será responsable por interrupciones temporales, pérdida de acceso, retrasos, errores o imposibilidad de uso del Servicio, salvo cuando la ley aplicable disponga lo contrario.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                23. Modificaciones al Servicio
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Podemos modificar, suspender, reemplazar o descontinuar cualquier parte de StudyFlow AI. No estamos obligados a mantener funciones gratuitas, beta, experimentales o no esenciales. Cuando un cambio afecte materialmente tus derechos u obligaciones, intentaremos notificarlo mediante la app, correo electrónico o publicación en el sitio.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                24. Propiedad intelectual de StudyFlow AI
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI, incluyendo su nombre, marca, logotipo, diseño, interfaz, código, estructura, funcionalidades, textos, componentes visuales, bases de datos, flujos, documentación y elementos propios, pertenece a Benjamin Conde Ramos o a sus licenciantes. Estos Términos no transfieren al usuario ningún derecho de propiedad intelectual sobre StudyFlow AI. No puedes copiar, modificar, distribuir, vender, sublicenciar, clonar, arrendar, explotar comercialmente, reproducir o crear obras derivadas de StudyFlow AI sin autorización previa y por escrito.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                25. Licencia limitada de uso
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Sujeto al cumplimiento de estos Términos, StudyFlow AI te otorga una licencia limitada, revocable, no exclusiva, no transferible y no sublicenciable para usar la Plataforma con fines personales, educativos o internos. Esta licencia termina cuando:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted">
                <li>Cancelas tu cuenta.</li>
                <li>StudyFlow AI suspende o elimina tu acceso.</li>
                <li>Incumples estos Términos.</li>
                <li>El Servicio deja de estar disponible.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                26. Privacidad y datos personales
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                El tratamiento de datos personales se rige por nuestro{" "}
                <Link href="/privacy" className="text-foreground hover:underline underline-offset-2">
                  Aviso de Privacidad
                </Link>
                . Al usar StudyFlow AI, aceptas que tus datos personales sean tratados conforme a dicho Aviso de Privacidad.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                27. Datos sensibles
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                StudyFlow AI no está diseñado para procesar datos personales sensibles. No debes subir ni escribir información relacionada con:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Salud física o mental.</li>
                <li>Religión.</li>
                <li>Opiniones políticas.</li>
                <li>Orientación sexual.</li>
                <li>Datos biométricos.</li>
                <li>Información financiera sensible.</li>
                <li>Expedientes médicos.</li>
                <li>Expedientes legales.</li>
                <li>Datos de menores sin autorización.</li>
                <li>Contraseñas, claves privadas, tokens o secretos.</li>
                <li>Información confidencial de terceros.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Si decides subir datos sensibles o confidenciales, lo haces bajo tu responsabilidad y declaras contar con autorización suficiente para ello.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                28. Eliminación de cuenta y datos
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Puedes solicitar la eliminación de tu cuenta escribiendo a: studyflowai122@gmail.com. Podremos conservar ciertos datos cuando sea necesario para:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted">
                <li>Cumplir obligaciones legales.</li>
                <li>Resolver disputas.</li>
                <li>Prevenir fraude o abuso.</li>
                <li>Hacer cumplir estos Términos.</li>
                <li>Mantener registros contables o fiscales.</li>
                <li>Proteger derechos de StudyFlow AI o de terceros.</li>
                <li>Investigar incidentes de seguridad.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                29. Suspensión o cancelación de cuenta
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Podemos suspender, limitar o cancelar tu cuenta si:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Incumples estos Términos.</li>
                <li>Usas el Servicio de forma abusiva.</li>
                <li>Intentas evadir límites técnicos o de pago.</li>
                <li>Generas riesgos de seguridad.</li>
                <li>Subes contenido ilegal, riesgoso o no autorizado.</li>
                <li>Afectas a otros usuarios.</li>
                <li>Generas costos excesivos o uso anormal.</li>
                <li>La ley o una autoridad competente lo exige.</li>
                <li>Usas la Plataforma para fines fraudulentos o ilícitos.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                La suspensión o cancelación puede implicar pérdida de acceso a la cuenta, sesiones, documentos, contenido generado, historial o funciones.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                30. Limitación de responsabilidad
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                En la medida máxima permitida por la ley aplicable, StudyFlow AI, sus operadores, colaboradores, proveedores, afiliados y representantes no serán responsables por:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted mb-3">
                <li>Daños indirectos, incidentales, especiales, punitivos o consecuenciales.</li>
                <li>Pérdida de datos, oportunidades o beneficios.</li>
                <li>Interrupción de estudios o errores académicos.</li>
                <li>Sanciones escolares o pérdida de reputación.</li>
                <li>Resultados incorrectos generados por IA.</li>
                <li>Uso indebido del contenido generado.</li>
                <li>Fallas de proveedores externos.</li>
                <li>Interrupciones del Servicio.</li>
                <li>Acceso no autorizado causado por negligencia del usuario.</li>
              </ol>
              <p className="text-foreground-muted leading-relaxed">
                Nuestra responsabilidad total acumulada frente a cualquier reclamación relacionada con StudyFlow AI se limitará al monto pagado por el usuario a StudyFlow AI durante los tres meses anteriores al evento que originó la reclamación, o a $500 MXN si el usuario no pagó por el Servicio. Algunas jurisdicciones no permiten ciertas limitaciones de responsabilidad, por lo que algunas limitaciones podrían no aplicarte.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                31. Exclusión de garantías
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                {`StudyFlow AI se proporciona "tal cual" y "según disponibilidad". No garantizamos que el Servicio sea ininterrumpido, libre de errores, que el contenido generado sea correcto, que los archivos se procesen correctamente ni que la Plataforma cumplirá expectativas específicas. El uso de StudyFlow AI es bajo tu propio riesgo.`}
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                32. Indemnización
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Aceptas defender, indemnizar y mantener libre de responsabilidad a StudyFlow AI, sus operadores, colaboradores, proveedores, afiliados y representantes frente a reclamaciones, daños, pérdidas, costos, gastos, sanciones y honorarios derivados de:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-foreground-muted">
                <li>Tu uso indebido del Servicio.</li>
                <li>Tu incumplimiento de estos Términos.</li>
                <li>Tu Contenido del Usuario.</li>
                <li>Tu infracción de derechos de terceros.</li>
                <li>Tu violación de leyes aplicables.</li>
                <li>Tu uso del contenido generado por IA.</li>
                <li>Tu carga de documentos sin autorización.</li>
                <li>Tu uso de datos personales de terceros sin autorización.</li>
                <li>Tu intento de evadir límites, pagos o medidas de seguridad.</li>
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                33. Legislación aplicable
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Estos Términos se regirán por las leyes aplicables de los Estados Unidos Mexicanos, sin perjuicio de derechos obligatorios de protección al consumidor, privacidad o legislación local que pudieran aplicar al usuario por disposición legal.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                34. Resolución informal de disputas
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Antes de iniciar cualquier procedimiento formal, las partes aceptan intentar resolver la disputa de buena fe. Para iniciar una reclamación, el usuario deberá enviar un aviso escrito a studyflowai122@gmail.com incluyendo: nombre completo, correo asociado a la cuenta, descripción clara del problema, solución solicitada y documentación relevante.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Las partes acuerdan intentar resolver la disputa informalmente durante al menos 30 días naturales antes de iniciar arbitraje o procedimiento judicial, salvo casos urgentes, medidas cautelares o cuando la ley no permita exigir este periodo.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                35. Acuerdo de arbitraje individual
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Salvo en los casos excluidos expresamente en estos Términos o cuando la ley aplicable lo prohíba, cualquier controversia, reclamación o disputa derivada de o relacionada con StudyFlow AI será resuelta mediante arbitraje individual y vinculante.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                El arbitraje será individual, confidencial y final. La sede será Playa Del Carmen, Quintana Roo, México, salvo acuerdo en contrario. El idioma será español. El árbitro tendrá autoridad para resolver sobre su propia competencia. Cada parte cubrirá sus propios honorarios legales, salvo que el árbitro determine otra cosa o la ley aplicable disponga lo contrario.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                36. Renuncia a acciones colectivas
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                En la medida máxima permitida por la ley aplicable, tú y StudyFlow AI aceptan que cualquier reclamación se presentará únicamente de forma individual. Las partes renuncian a participar en demandas colectivas, acciones representativas, arbitrajes colectivos o masivos y reclamaciones consolidadas.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                Si una autoridad competente determina que esta renuncia no es aplicable respecto de una reclamación específica, dicha reclamación deberá separarse y resolverse ante el foro competente, mientras que las demás reclamaciones seguirán sujetas a arbitraje individual.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                37. Excepciones al arbitraje
              </h2>
              <p className="text-foreground-muted leading-relaxed mb-3">
                Nada en estos Términos impide que cualquiera de las partes solicite medidas cautelares, provisionales o urgentes ante tribunales competentes cuando sean necesarias para proteger: propiedad intelectual, seguridad de la Plataforma, confidencialidad, datos personales, infraestructura, cuentas de usuario, sistemas técnicos, secretos comerciales o para prevenir daños irreparables.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                También podrán excluirse del arbitraje: reclamaciones que la ley no permita arbitrar, procedimientos ante autoridades de consumo o privacidad, reclamaciones de menor cuantía, y acciones para proteger propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                38. Usuarios de otros países
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                StudyFlow AI puede estar disponible para usuarios fuera de México. El usuario es responsable de cumplir las leyes locales que le apliquen. Si usas StudyFlow AI desde otro país, aceptas que tus datos pueden procesarse en México, Estados Unidos u otros países donde operen nuestros proveedores tecnológicos, conforme al Aviso de Privacidad. Nada en estos Términos limita derechos obligatorios que no puedan renunciarse conforme a la ley aplicable.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                39. Plazo para presentar reclamaciones
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                En la medida permitida por la ley aplicable, cualquier reclamación relacionada con StudyFlow AI deberá presentarse dentro del plazo máximo de un año contado a partir del hecho que originó la reclamación. Si la ley aplicable exige un plazo mayor, se aplicará el plazo mínimo permitido por dicha ley.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                40. Cambios a estos Términos
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Podemos actualizar estos Términos para reflejar cambios legales, técnicos, comerciales o funcionales. Cuando los cambios sean materiales, intentaremos notificarte por correo electrónico, dentro de la app o mediante aviso visible en el sitio. El uso continuo de StudyFlow AI después de la entrada en vigor de los cambios significa que aceptas los nuevos Términos. Si no estás de acuerdo, debes dejar de usar StudyFlow AI y, si corresponde, cancelar tu cuenta.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                41. Cesión
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                No puedes ceder ni transferir tus derechos u obligaciones bajo estos Términos sin nuestro consentimiento previo por escrito. StudyFlow AI podrá ceder estos Términos en caso de reorganización, adquisición, fusión, venta de activos, cambio de control o transferencia del negocio.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                42. Divisibilidad
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Si alguna disposición de estos Términos se considera inválida, ilegal o inaplicable, dicha disposición se aplicará en la máxima medida permitida o se eliminará, sin afectar la validez del resto de los Términos.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                43. No renuncia
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                El hecho de que StudyFlow AI no exija el cumplimiento de alguna disposición no constituye renuncia a ese derecho.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                44. Acuerdo completo
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Estos Términos, junto con el{" "}
                <Link href="/privacy" className="text-foreground hover:underline underline-offset-2">
                  Aviso de Privacidad
                </Link>{" "}
                y cualquier política adicional publicada por StudyFlow AI, constituyen el acuerdo completo entre el usuario y StudyFlow AI respecto del uso del Servicio.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">
                45. Contacto
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                Para preguntas sobre estos Términos, puedes contactarnos en:
              </p>
              <ul className="space-y-1 text-foreground-muted mt-3 pl-1">
                <li><span className="text-foreground font-medium">Correo de soporte:</span> studyflowai122@gmail.com</li>
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
