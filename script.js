window.onerror = function (message, source, lineno, colno, error) {

	    console.error("Error capturado globalmente:", message, source, lineno, colno, error);

	    return true; // Evita que el error se propague y se muestre en la consola de forma predeterminada.


};

// --- Variables Globales ---


const faceGrid = document.getElementById('face-grid');

let targetSequence1 = []; // Secuencia para el nivel 1 (array)


let targetSequence2 = "";
  // Secuencia para el nivel 2 (string - la frase completa)


let currentSequence = [];
  // Secuencia actual del jugador (nivel 1)


let level1Completed = false;

let currentLevel = 1;

const pastelColors = ["#FFFFE0", "#FFB6C1", "#98FB98", "#ADD8E6", "#E6E6FA", "#FFFACD", "#F08080", "#FFD700"];

let featuredFaceContainer;

// let animationIntervals = []; // Para almacenar los IDs de los intervalos de animación.  NO SE USA


const faceTextColors = [

	    "#000000", // Negro


	    "#333333", // Gris muy oscuro


	    "#224466", // Azul oscuro


	    "#443322", // Marrón oscuro


	    "#551A8B", // Púrpura oscuro


];

// --- Funciones de Utilidad ---


function getRandomElement(array) {

	    return array[Math.floor(Math.random() * array.length)];

}

// --- Funciones para las Caras ---


function setRandomBackgroundColor(element) {

	    element.style.backgroundColor = getRandomElement(pastelColors);

}

function createFace(isFeatured) {

	    const eyes = ["o", "O", "0", "@"];

	    const noses = [".", "|", "-"];

	    const mouths = isFeatured ? ["__"] : ["_", "-", "w", "v", "u", "__"];

	    const leftEye = getRandomElement(eyes);

	    const rightEye = getRandomElement(eyes);

	    const nose = getRandomElement(noses);

	    const mouth = getRandomElement(mouths);

	    return `<div class="eyes-nose-container"><span>${leftEye}</span><span>${nose}</span><span>${rightEye}</span></div><div><span>${mouth}</span></div>`;

}

function createFeaturedFace() {

	        featuredFaceContainer = document.createElement('div');

	        featuredFaceContainer.id = 'featured-face';

	        featuredFaceContainer.innerHTML = `<span class="face-text">${createFace(true)}</span>`;

	        setRandomBackgroundColor(featuredFaceContainer);

	        featuredFaceContainer.querySelector('.face-text').style.color = getRandomElement(faceTextColors);

	        document.getElementById('game-screen').appendChild(featuredFaceContainer);

	        console.log("featuredFaceContainer created and appended:", featuredFaceContainer); // Verificar


	   
}

function removeFeaturedFace() {

	    if (featuredFaceContainer) {

		        featuredFaceContainer.remove();

		        featuredFaceContainer = null;

		   
	}

}

function stealFace(clickedFace) {

	    if (!featuredFaceContainer)
		return;

	    featuredFaceContainer.querySelector('.face-text').innerHTML = clickedFace.querySelector('.face-text').innerHTML;

	    featuredFaceContainer.querySelector('.face-text').style.color = clickedFace.querySelector('.face-text').style.color;

	    setRandomBackgroundColor(featuredFaceContainer);

}

function createFaceElement() {

	    const faceBox = document.createElement('div');

	    faceBox.classList.add('face-box');

	    setRandomBackgroundColor(faceBox);

	    const faceText = document.createElement('span');

	    faceText.classList.add('face-text');

	    faceText.innerHTML = createFace(false);

	    faceText.style.color = getRandomElement(faceTextColors);

	    faceBox.appendChild(faceText);

	    faceBox.addEventListener('click', function () {

		        if (hackActive)
			return;

		        const faceContent = this.querySelector('.face-text').innerHTML;

		        const faceColor = this.querySelector('.face-text').style.color;

		        if (currentLevel === 1) {

			            //Lógica del nivel 1 se mantiene igual


			            currentSequence.push({
				html: faceContent,
				color: faceColor
			});

			            this.classList.add('selected');

			            stealFace(this);

			            const targetIndex = currentSequence.length;

			            const footerFace = document.querySelector(`.target-faces .face-box:nth-child(${targetIndex})`);

			            if (footerFace) {

				                footerFace.style.backgroundColor = 'grey';

				           
			}

			            const isCorrect = checkSequence();

			            if (!isCorrect && currentSequence.length === targetSequence1.length) {

				                alert("Secuencia incorrecta. Inténtalo de nuevo.");

				                currentSequence = [];

				                document.querySelectorAll('.face-box.selected').forEach(face => face.classList.remove('selected'));

				                document.querySelectorAll('.target-faces .face-box').forEach(face => face.style.backgroundColor = '');

				           
			}

			       
		} else if (currentLevel === 2) {

			            // Nivel 2: Lógica para rellenar los posits.


			            const blankPosits = document.querySelectorAll('.target-faces .blank-face'); // Obtener los posits vacíos.


			            if (blankPosits.length > 0) {

				                const firstBlank = blankPosits[0]; // Obtener el primer posit vacío.


				                firstBlank.innerHTML = this.querySelector('.face-text').innerHTML; // Copiar el HTML de la cara.


				                firstBlank.style.backgroundColor = this.style.backgroundColor; // Copiar el color de fondo.


				                firstBlank.style.color = this.querySelector('.face-text').style.color; //Copiar color de texto


				                firstBlank.classList.remove('blank-face'); // Quitar la clase 'blank-face'.


				                this.classList.add('selected'); // Marcar la cara del fondo como seleccionada.


				                stealFace(this);

				                // Verificar si se completaron los dos posits.


				                //SOLO AQUI se debe llamar a la función checkSequence.


				                if (document.querySelectorAll('.target-faces .blank-face').length === 0) {

					                    const isCorrect = checkSequence();

					                    if (!isCorrect) {

						                        alert("La frase es incorrecta.");

						                        resetGame(); // Reiniciar si es incorrecta.


						                   
					}

					               
				}

				           
			}

			       
		}

		   
	});

	    return faceBox;

}

function updateFaces() {

	    faceGrid.innerHTML = '';

	    const numFaces = Math.floor((window.innerWidth * window.innerHeight) / (60 * 65));

	    for (let i = 0; i < numFaces; i++) {

		        let face = createFaceElement();

		        faceGrid.appendChild(face);

		        console.log("animateFace called for:", face); // AÑADIR ESTE LOG


		        animateFace(face);

		   
	}

	    faceGrid.offsetHeight; // <-- DEBE ESTAR AQUÍ


	    // document.querySelectorAll('#face-grid .face-box').forEach(face => animateFace(face));  <-- ELIMINAR


	    if (currentLevel === 1) {

		        displayTargetSequence(targetSequence1);

		   
	}

}

function animateFace(face) {
    // Si el hack está activo y la cara está en el footer, no animar
    if (hackActive && face.closest('.target-faces')) {
        return;
    }

    let lastUpdate = Date.now();
    const updateInterval = 33000;

    const update = () => {
        // Si el hack está activo y la cara está en el footer, detener la animación
        if (hackActive && face.closest('.target-faces')) {
            cancelAnimationFrame(face.animationRequestId);
            return;
        }

        const now = Date.now();
        if (now - lastUpdate > updateInterval) {
            const faceText = face.querySelector('.face-text');
            if (faceText) {
                faceText.innerHTML = createFace(false);
                faceText.style.color = getRandomElement(faceTextColors);
                setRandomBackgroundColor(face);
            }
            lastUpdate = now;
        }

        const scale = 1 + Math.random() * 0.1;
        const rotate = (Math.random() - 0.5) * 20;
        face.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
        face.animationRequestId = requestAnimationFrame(update);
    };

    setTimeout(update, 0);
}

function clearAnimationIntervals() {

	    document.querySelectorAll('#face-grid .face-box').forEach(face => {

		        if (face.animationRequestId) {

			            cancelAnimationFrame(face.animationRequestId);

			            face.animationRequestId = null; // ¡IMPORTANTE! Limpiar la propiedad.


			       
		}

		   
	});

}

// --- Funciones para la Secuencia Objetivo ---


function generateTargetSequence(length) {

	    return Array.from({
		length
	}, () => ({
			html: createFace(false),
			color: getRandomElement(faceTextColors)
		}));

}

function displayTargetSequence(sequence) {

	    const container = document.querySelector('.target-faces');

	    if (!container) {

		        console.error("Contenedor '.target-faces' no encontrado.");

		        return;

		   
	}

	    container.innerHTML = ''; // Limpiar contenido anterior.


	    sequence.forEach(faceData => {

		        const faceBox = document.createElement('div');

		        faceBox.classList.add('face-box');

		        const faceText = document.createElement('span'); // Crear el elemento span


		        faceText.classList.add('face-text');

		        faceText.style.color = faceData.color; // Usar el color del objeto faceData


		        faceText.style.fontSize = '20px';

		        faceText.innerHTML = faceData.html; // Insertar el HTML de la cara


		        faceBox.appendChild(faceText); // Añadir el span al faceBox


		        container.appendChild(faceBox);

		   
	});

}

const faceAlphabet = {

	    'A': '<div class="eyes-nose-container"><span>o</span><span>.</span><span>o</span></div><div><span>_</span></div>',

	    'B': '<div class="eyes-nose-container"><span>O</span><span>.</span><span>O</span></div><div><span>_</span></div>',

	    'C': '<div class="eyes-nose-container"><span>0</span><span>.</span><span>0</span></div><div><span>_</span></div>',

	    'D': '<div class="eyes-nose-container"><span>o</span><span>|</span><span>o</span></div><div><span>_</span></div>',

	    'E': '<div class="eyes-nose-container"><span>O</span><span>|</span><span>O</span></div><div><span>_</span></div>',

	    'F': '<div class="eyes-nose-container"><span>0</span><span>|</span><span>0</span></div><div><span>_</span></div>',

	    'G': '<div class="eyes-nose-container"><span>o</span><span>-</span><span>o</span></div><div><span>_</span></div>',

	    'H': '<div class="eyes-nose-container"><span>O</span><span>-</span><span>O</span></div><div><span>_</span></div>',

	    'I': '<div class="eyes-nose-container"><span>0</span><span>-</span><span>0</span></div><div><span>_</span></div>',

	    'J': '<div class="eyes-nose-container"><span>o</span><span>.</span><span>o</span></div><div><span>-</span></div>',

	    'K': '<div class="eyes-nose-container"><span>O</span><span>.</span><span>O</span></div><div><span>-</span></div>',

	    'L': '<div class="eyes-nose-container"><span>0</span><span>.</span><span>0</span></div><div><span>-</span></div>',

	    'M': '<div class="eyes-nose-container"><span>o</span><span>|</span><span>o</span></div><div><span>-</span></div>',

	    'N': '<div class="eyes-nose-container"><span>O</span><span>|</span><span>O</span></div><div><span>-</span></div>',

	    'Ñ': '<div class="eyes-nose-container"><span>0</span><span>|</span><span>0</span></div><div><span>-</span></div>',

	    'O': '<div class="eyes-nose-container"><span>o</span><span>-</span><span>o</span></div><div><span>-</span></div>',

	    'P': '<div class="eyes-nose-container"><span>O</span><span>-</span><span>O</span></div><div><span>-</span></div>',

	    'Q': '<div class="eyes-nose-container"><span>0</span><span>-</span><span>0</span></div><div><span>-</span></div>',

	    'R': '<div class="eyes-nose-container"><span>o</span><span>.</span><span>o</span></div><div><span>w</span></div>',

	    'S': '<div class="eyes-nose-container"><span>O</span><span>.</span><span>O</span></div><div><span>w</span></div>',

	    'T': '<div class="eyes-nose-container"><span>0</span><span>.</span><span>0</span></div><div><span>w</span></div>',

	    'U': '<div class="eyes-nose-container"><span>o</span><span>|</span><span>o</span></div><div><span>w</span></div>',

	    'V': '<div class="eyes-nose-container"><span>O</span><span>|</span><span>O</span></div><div><span>w</span></div>',

	    'W': '<div class="eyes-nose-container"><span>0</span><span>|</span><span>0</span></div><div><span>w</span></div>',

	    'X': '<div class="eyes-nose-container"><span>o</span><span>-</span><span>o</span></div><div><span>w</span></div>',

	    'Y': '<div class="eyes-nose-container"><span>O</span><span>-</span><span>O</span></div><div><span>w</span></div>',

	    'Z': '<div class="eyes-nose-container"><span>0</span><span>-</span><span>0</span></div><div><span>w</span></div>',

	    'Ä': '<div class="eyes-nose-container"><span>@</span><span>.</span><span>@</span></div><div><span>_</span></div>',

	    'Ö': '<div class="eyes-nose-container"><span>@</span><span>|</span><span>@</span></div><div><span>_</span></div>',

	    'Ü': '<div class="eyes-nose-container"><span>@</span><span>-</span><span>@</span></div><div><span>_</span></div>',

	    ' ': '<div class="eyes-nose-container"><span> </span><span> </span><span> </span></div><div><span> </span></div>', // Espacio


};

// --- Frases Positivas (Nivel 2) ---


const positivePhrases = [

	    "BE YOUR BEST", //Ejemplo


	    "TODO ES AMOR",

	    "ALEGRIA Y FE",

	    "AMOR Y RISAS"

];

function getRandomPhrase() {

	    return positivePhrases[Math.floor(Math.random() * positivePhrases.length)];

}

function displayLevel2Sequence() {

	    const container = document.querySelector('.target-faces');

	    if (!container) {

		        console.error("Contenedor '.target-faces' no encontrado.");

		        return;

		   
	}

	    container.innerHTML = ''; // Limpiar contenido anterior.


	    const phrase = getRandomPhrase();

	    targetSequence2 = phrase;

	    const phraseLetters = phrase.substring(0, 10);

	    for (let i = 0; i < phraseLetters.length; i++) {

		        const letter = phraseLetters[i].toUpperCase();

		        const faceHtml = faceAlphabet[letter] || createFace(false);

		        const faceBox = document.createElement('div');

		        faceBox.classList.add('face-box');

		        faceBox.id = `footer-face-${i}`;

		        const faceText = document.createElement('span');

		        faceText.classList.add('face-text');

		        faceText.style.color = getRandomElement(faceTextColors);

		        faceText.style.fontSize = '20px';

		        faceText.innerHTML = faceHtml;

		        faceBox.appendChild(faceText);

		        container.appendChild(faceBox);

		   
	}

	    // Añadir dos posits en blanco (¡CORREGIDO!).


	    for (let i = 0; i < 2; i++) {

		        const blankBox = document.createElement('div');

		        blankBox.classList.add('face-box', 'blank-face');

		        blankBox.id = `footer-face-${10 + i}`;

		        // --- Crear la estructura INTERNA del posit (igual que las otras caras) ---


		        const faceText = document.createElement('span');

		        faceText.classList.add('face-text');

		        faceText.style.fontSize = '20px'; // Mantener el estilo.


		        // No se pone color de fondo, ni contenido, porque está vacío.


		        blankBox.appendChild(faceText); // <-- ¡Añadir el span al posit!


		        container.appendChild(blankBox);

		   
	}

}

// --- Lógica del Juego ---


function checkSequence() {
    if (currentLevel === 1) {
        // Verificar si la longitud de la secuencia actual coincide con la objetivo
        if (currentSequence.length !== targetSequence1.length) {
            return false;
        }

        // Comparar cada elemento de las secuencias
        for (let i = 0; i < currentSequence.length; i++) {
            if (currentSequence[i].html !== targetSequence1[i].html) {
                return false;
            }
        }

        // Si llegamos aquí, la secuencia es correcta
        if (currentSequence.length === targetSequence1.length) {
            clearAnimationIntervals();
            showModal("¡Nivel 1 Completado!", "¡Has completado el nivel 1!", true);
            level1Completed = true;
            return true;
        }
        return false;
    } 
    else if (currentLevel === 2) {
        const footerFaces = document.querySelectorAll('.target-faces .face-box');
        let constructedPhrase = '';
        
        function normalizeHTML(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.innerHTML.replace(/\s+/g, '');
        }

        footerFaces.forEach(faceBox => {
            const faceText = faceBox.querySelector('.face-text');
            if (faceText) {
                const faceHTML = normalizeHTML(faceText.innerHTML);
                
                for (const [letter, html] of Object.entries(faceAlphabet)) {
                    if (normalizeHTML(html) === faceHTML) {
                        constructedPhrase += letter;
                        break;
                    }
                }
            }
        });

        console.log("checkSequence (Nivel 2) - attemptedPhrase:", constructedPhrase, "targetSequence2:", targetSequence2);

        const isCorrect = constructedPhrase === targetSequence2;
        
        if (isCorrect) {
            clearAnimationIntervals();
            showModal("¡Nivel 2 Completado!", "¡Has completado el nivel 2!", false);
            return true;
        }
        
        return false;
    }
    return false;
}

function enableArrow(arrowElement) {

	    if (arrowElement)
		arrowElement.classList.remove('disabled');

}

function disableArrow(arrowElement) {

	    if (arrowElement)
		arrowElement.classList.add('disabled');

}

let upArrow, downArrow; // Declara las variables fuera


function setupArrowListeners() {

	    // Eliminar listeners anteriores (IMPORTANTE)


	    if (upArrow) {

		        upArrow.removeEventListener('click', upArrowClickHandler);

		   
	}

	    if (downArrow) {

		        downArrow.removeEventListener('click', downArrowClickHandler);

		   
	}

	    upArrow = document.querySelector('.footer-arrows .up-arrow');

	    downArrow = document.querySelector('.footer-arrows .down-arrow');

	    if (upArrow) {

		        upArrow.addEventListener('click', upArrowClickHandler);

		   
	}

	    if (downArrow) {

		        downArrow.addEventListener('click', downArrowClickHandler);

		   
	}

}

// Funciones de manejo de clic para las flechas (CORREGIDAS)


function upArrowClickHandler() {

	    if (currentLevel === 1) {

		        goToSection('game-screen'); // Nivel 1: Arriba SIEMPRE va a game-screen


		   
	} else if (currentLevel === 2) {

		        goToSection('game-screen'); // Nivel 2: Arriba va a game-screen.


		   
	}

}

function downArrowClickHandler() {

	    if (currentLevel === 1) {

		        goToSection('level1-instructions'); // Nivel 1: Abajo va a level1-instructions


		   
	} else if (currentLevel === 2) {

		        goToSection('level2-instructions'); // Nivel 2: Abajo va a level2-instructions


		   
	}

}

function goToSection(sectionId) {

	    //clearAnimationIntervals();


	    const targetSection = document.getElementById(sectionId);

	    if (!targetSection)
		return;

	    // Ocultar TODAS las secciones primero.


	    document.querySelectorAll('.screen').forEach(section => {

		        section.style.display = 'none';

		   
	});

	    // Mostrar la sección objetivo.


	    targetSection.style.display = 'flex';

	    targetSection.scrollIntoView({
		behavior: 'smooth'
	});

	    if (sectionId === 'game-screen') {

		        if (!featuredFaceContainer) {

			            createFeaturedFace();

			       
		}

		        featuredFaceContainer.style.display = 'flex';

		        // Actualizar footer según el nivel.


		        if (currentLevel === 1) {

			            displayTargetSequence(targetSequence1);

			       
		} else if (currentLevel === 2) {

			            displayLevel2Sequence();

			       
		}

		   
	} else {

		        if (featuredFaceContainer) {

			            featuredFaceContainer.style.display = 'none';

			       
		}

		   
	}

	    // Deshabilitar ambas inicialmente.  La lógica de upArrowClickHandler y downArrowClickHandler


	    // se encarga de la navegación *entre* niveles.


	    const upArrow = document.querySelector('.footer-arrows .up-arrow');

	const downArrow = document.querySelector('.footer-arrows .down-arrow');

	    disableArrow(upArrow);

	    disableArrow(downArrow);

	    if (sectionId === 'game-screen') {

		        enableArrow(downArrow); // En game-screen, siempre habilitar flecha abajo


		   
	} else if (sectionId === 'level1-instructions') {

		        enableArrow(upArrow);

		        enableArrow(downArrow);

		   
	} else if (sectionId === 'level2-instructions') {

		        enableArrow(upArrow);

		        enableArrow(downArrow);

		   
	}

	    setupArrowListeners(); // Re-inicializar los listeners


}

// --- INICIO DE LA IMPLEMENTACIÓN DEL HACK (CORREGIDO) ---


let hackActive = false;

let hackInterval;

// let hackedFaces = []; // Ya no se usa en el nivel 2


let comparisonCount = 0; // Solo se usa en nivel 1


function triggerHack() {
    hackActive = !hackActive;

    if (hackActive && currentLevel === 1) {
        alert("Hack ACTIVADO");
        currentSequence = [];
        hackedFaces = [];
        comparisonCount = 0;
        document.querySelectorAll('.target-faces .face-box').forEach(face => face.style.pointerEvents = 'none');
        let index = 0;
        let attempts = 0;
        const maxAttempts = 100;

        clearInterval(hackInterval);
        hackInterval = setInterval(() => {
            if (index < targetSequence1.length) {
                const targetFace = targetSequence1[index];
                let faceToClick = null;

                // Buscar la cara correcta
                for (let i = 0; i < faceGrid.children.length; i++) {
                    const bgFaceText = faceGrid.children[i].querySelector('.face-text');
                    comparisonCount++;
                    if (bgFaceText.innerHTML === targetFace.html) {
                        faceToClick = faceGrid.children[i];
                        break;
                    }
                }

                if (faceToClick) {
                    faceToClick.click();
                    faceToClick.style.backgroundColor = 'grey';
                    hackedFaces.push(faceToClick);
                    index++;
                    attempts = 0;

                    const footerFace = document.querySelector(`.target-faces .face-box:nth-child(${hackedFaces.length})`);
                    if (footerFace) {
                        footerFace.style.backgroundColor = 'grey';
                    }
                } else {
                    attempts++;
                    console.log(`Intento fallido #${attempts} para la cara ${index + 1}`);
                    if (attempts >= maxAttempts) {
                        clearInterval(hackInterval);
                        clearAnimationIntervals();
                        alert("No se pudo resolver el nivel. Demasiados intentos fallidos.");
                        hackActive = false;
                        // Reactivar animaciones
                        document.querySelectorAll('.face-box').forEach(face => {
                            if (face && !face.closest('.target-faces')) {
                                animateFace(face);
                            }
                        });
                        resetGame();
                        return;
                    }
                }
            } else {
                clearInterval(hackInterval);
                clearAnimationIntervals();
                hackActive = false;
                showModal("¡Nivel 1 Completado (Hack)!", "Has completado el nivel 1 usando el hack.", true);
                // Reactivar animaciones
                document.querySelectorAll('.face-box').forEach(face => {
                    if (face && !face.closest('.target-faces')) {
                        animateFace(face);
                    }
                });
                resetGame();
                levelTransition();
            }
        }, 550);
    } 
    else if (hackActive && currentLevel === 2) {
        alert("Hack de Nivel 2 ACTIVADO");
        
        // Pausar todas las animaciones al inicio del hack
        clearAnimationIntervals();
        
        function normalizeHTML(html) {
            if (!html) return '';
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.innerHTML.replace(/\s+/g, '');
        }

        function findMatchingFace(targetLetter) {
            if (!targetLetter) return null;
            
            console.log("Buscando cara para letra:", targetLetter);
            
            // Obtener directamente la cara del alfabeto
            const targetFaceHTML = faceAlphabet[targetLetter.toUpperCase()];
            if (!targetFaceHTML) {
                console.log("No se encontró la letra en el alfabeto:", targetLetter);
                return null;
            }
            
            // Crear el elemento de la cara directamente con el HTML del alfabeto
            const faceElement = document.createElement('div');
            faceElement.classList.add('face-box');
            faceElement.style.backgroundColor = getRandomElement(pastelColors);
            
            const faceText = document.createElement('span');
            faceText.classList.add('face-text');
            faceText.innerHTML = targetFaceHTML;
            faceText.style.color = getRandomElement(faceTextColors);
            
            faceElement.appendChild(faceText);
            console.log("Cara creada para letra:", targetLetter);
            
            return faceElement;
        }

        async function attemptHack() {
            if (!hackActive) return;

            const phrase = targetSequence2.trim();
            const lastLetters = phrase.slice(-2).split('');
            console.log("Buscando últimas letras:", lastLetters);

            // Crear las caras necesarias
            const face1 = findMatchingFace(lastLetters[0]);
            const face2 = findMatchingFace(lastLetters[1]);

            if (face1 && face2) {
                const blankPosits = document.querySelectorAll('.target-faces .blank-face');
                
                if (blankPosits.length === 2) {
                    console.log("Colocando caras para letras:", lastLetters);
                    
                    // Colocar primera cara
                    const faceText1 = document.createElement('span');
                    faceText1.classList.add('face-text');
                    faceText1.innerHTML = face1.querySelector('.face-text').innerHTML;
                    faceText1.style.color = face1.querySelector('.face-text').style.color;
                    
                    blankPosits[0].innerHTML = ''; // Limpiar primero
                    blankPosits[0].appendChild(faceText1);
                    blankPosits[0].style.backgroundColor = face1.style.backgroundColor;
                    blankPosits[0].classList.remove('blank-face');
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Colocar segunda cara
                    if (!hackActive) return;
                    
                    const faceText2 = document.createElement('span');
                    faceText2.classList.add('face-text');
                    faceText2.innerHTML = face2.querySelector('.face-text').innerHTML;
                    faceText2.style.color = face2.querySelector('.face-text').style.color;
                    
                    blankPosits[1].innerHTML = ''; // Limpiar primero
                    blankPosits[1].appendChild(faceText2);
                    blankPosits[1].style.backgroundColor = face2.style.backgroundColor;
                    blankPosits[1].classList.remove('blank-face');
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Verificar que las caras se colocaron correctamente
                    const verifyFaces = document.querySelectorAll('.target-faces .face-box');
                    for (const face of verifyFaces) {
                        const faceText = face.querySelector('.face-text');
                        if (!faceText || !faceText.innerHTML) {
                            console.log("Error: Verificación falló - Cara vacía encontrada");
                            hackActive = false;
                            resetGame();
                            displayLevel2Sequence();
                            return;
                        }
                    }
                    
                    // Construir y verificar la frase
                    let constructedPhrase = '';
                    const footerFaces = document.querySelectorAll('.target-faces .face-box');
                    
                    for (const faceBox of footerFaces) {
                        const faceText = faceBox.querySelector('.face-text');
                        const faceHTML = normalizeHTML(faceText.innerHTML);
                        let letterFound = false;
                        
                        for (const [letter, html] of Object.entries(faceAlphabet)) {
                            if (normalizeHTML(html) === faceHTML) {
                                constructedPhrase += letter;
                                letterFound = true;
                                break;
                            }
                        }
                        
                        if (!letterFound) {
                            console.log("No se pudo identificar una letra");
                            hackActive = false;
                            resetGame();
                            displayLevel2Sequence();
                            return;
                        }
                    }
                    
                    console.log("Frase construida:", constructedPhrase);
                    console.log("Frase objetivo:", targetSequence2);
                    
                    if (constructedPhrase === targetSequence2) {
                        hackActive = false;
                        showModal("¡Nivel 2 Completado (Hack)!", 
                            "Has completado el nivel 2 usando el hack.", false);
                    } else {
                        console.log("Frase incorrecta, reintentando...");
                        hackActive = false;
                        resetGame();
                        displayLevel2Sequence();
                    }
                }
            } else {
                console.log("No se pudieron crear las caras necesarias");
                hackActive = false;
                alert("No se pudo completar el hack. Reintentando...");
                resetGame();
                displayLevel2Sequence();
            }
            
            // Reactivar animaciones al final
            document.querySelectorAll('.face-box').forEach(face => {
                if (face && !face.closest('.target-faces')) {
                    animateFace(face);
                }
            });
        }

        // Iniciar el hack
        attemptHack();
    } 
    else {
        alert(hackActive ? "El hack solo funciona en el nivel 1 o 2" : "Hack DESACTIVADO");
        clearInterval(hackInterval);
        clearAnimationIntervals();
        hackActive = false;
        // Reactivar animaciones al desactivar el hack
        document.querySelectorAll('.face-box').forEach(face => {
            if (face && !face.closest('.target-faces')) {
                animateFace(face);
            }
        });
        resetGame();
    }
}

function showModal(title, message, showNextLevelButton) {

	    document.getElementById('modal-title').textContent = title;

	    document.getElementById('modal-message').textContent = message;

	    document.getElementById('next-level-button').style.display = showNextLevelButton ? 'inline-block' : 'none';

	    document.getElementById('modal').style.display = 'block';

	    const closeButton = document.querySelector('.close-button');

	    const nextLevelButton = document.getElementById('next-level-button');

	    const restartButton = document.getElementById('restart-button');

	    function closeModal() {

		        hideModal();

		        closeButton.removeEventListener('click', closeModal);

		        nextLevelButton.removeEventListener('click', nextLevel);

		        restartButton.removeEventListener('click', restart);

		   
	}

	    function nextLevel() {

		        if (currentLevel === 1) {

			            currentLevel = 2;

			            levelTransition(); // <--  ¡AQUÍ, ANTES de hideModal()!


			            hideModal();
			        // <--  Después de la transición.


			       
		}

		   
	}

	    function restart() {

		        currentLevel = 1;

		        resetGame();

		        hideModal();

		        goToSection('game-screen');

		   
	}

	    closeButton.addEventListener('click', closeModal);

	    if (showNextLevelButton) {

		        nextLevelButton.addEventListener('click', nextLevel);

		   
	}

	    restartButton.addEventListener('click', restart);

}

function hideModal() {

	    document.getElementById('modal').style.display = 'none';

}

function resetGame() {

	    hackActive = false;

	    currentSequence = [];

	    document.querySelectorAll('.face-box.selected').forEach(face => face.classList.remove('selected'));

	    document.querySelectorAll('.target-faces .face-box').forEach(face => face.style.backgroundColor = '');

	    document.querySelectorAll('#face-grid .face-box').forEach(setRandomBackgroundColor);

	    document.querySelectorAll('.target-faces .face-box').forEach(face => {

		        face.style.pointerEvents = 'auto';

		        if (face.classList.contains('blank-face')) {

			            face.innerHTML = ""; // Limpiar posits


			       
		}

		   
	});

	    if (currentLevel === 1) {

		        targetSequence1 = generateTargetSequence(7);

		        displayTargetSequence(targetSequence1);

		   
	} // <--  Ya no se llama a displayLevel2Sequence aquí.


	    updateFaces();

}

// --- Función de Transición de Nivel ---


function levelTransition() {

	    if (currentLevel === 2) {

		        goToSection('level2-instructions');

		        displayLevel2Sequence(); // Configurar el nivel 2 (frase, posits)


		        displayAlphabet();
		        // Mostrar el alfabeto


		   
	}

	    updateFaces(); // Actualizar las caras, SIEMPRE.


}

// --- Función para mostrar el alfabeto en las instrucciones del Nivel 2 ---


function displayAlphabet() {

	    const tableBody = document.querySelector('#alphabet-table tbody');

	    if (!tableBody) {

		        console.error("No se encontró el tbody de la tabla del alfabeto.");

		        return;

		   
	}

	    tableBody.innerHTML = ''; // Limpiar contenido anterior.


	    const letters = Object.keys(faceAlphabet);

	    const rows = Math.ceil(letters.length / 11);

	    for (let i = 0; i < rows; i++) {

		        const row = document.createElement('tr');

		        for (let j = 0; j < 11; j++) {

			            const index = i * 11 + j;

			            if (index < letters.length) {

				                const letter = letters[index];

				                const faceHtml = faceAlphabet[letter];

				                const cell = document.createElement('td');

				                const faceBox = document.createElement('div');

				                faceBox.classList.add('face-box');

				                const faceText = document.createElement('span');

				                faceText.classList.add('face-text');

				                faceText.innerHTML = faceHtml;

				                faceText.style.color = getRandomElement(faceTextColors);

				                faceBox.appendChild(faceText);

				                cell.appendChild(faceBox);

				                const letterText = document.createElement('p');

				                letterText.textContent = letter;

				                letterText.style.marginTop = '5px';

				                cell.appendChild(letterText);

				                row.appendChild(cell);

				           
			} else {

				                // Celda vacía si no hay más letras.


				                row.appendChild(document.createElement('td'));

				           
			}

			       
		}

		        tableBody.appendChild(row);

		   
	}

}

// Event listener para Ctrl+H


document.addEventListener('keydown', (event) => {

	    if ((event.ctrlKey || event.metaKey) && (event.key === 'h' || event.key === 'H')) {

		        event.preventDefault();

		        triggerHack();

		   
	}

});

function initGame() {

	    targetSequence1 = generateTargetSequence(7); // Usar targetSequence1 para el nivel 1


	    displayTargetSequence(targetSequence1); // Pasar targetSequence1


	    updateFaces();

}

document.addEventListener('DOMContentLoaded', () => {

	    console.log("DOMContentLoaded event fired!");

	    initGame(); // Inicializar el juego (secuencia, caras, etc.).


	    goToSection('game-screen'); // <-- MOSTRAR la pantalla del juego.


	    // --- Listener de visibilidad (sin cambios) ---


	    document.addEventListener('visibilitychange', function () {

		        if (document.visibilityState === 'visible') {

			            console.log("Página visible, reanudando animación");

			            updateFaces();

			       
		} else {

			            console.log("Página oculta, pausando animación");

			            clearAnimationIntervals();

			       
		}

		   
	});

	    setupArrowListeners(); // <-- Configurar listeners INICIALMENTE.


	    window.addEventListener('resize', updateFaces);

	    window.addEventListener('orientationchange', updateFaces);

});

// --- Funciones para el manejo de los clicks en las flechas (CORREGIDAS) ---


function upArrowClickHandler() {

	    //SIMPLIFICADA:  Siempre va a game-screen, independientemente de dónde estemos.


	    goToSection('game-screen');

}

function downArrowClickHandler() {

	      //Siempre va a las instrucciones del nivel actual.


	    if (currentLevel === 1) {

		        goToSection('level1-instructions');

		   
	} else if (currentLevel === 2) {

		        goToSection('level2-instructions');

		   
	}

}
 
