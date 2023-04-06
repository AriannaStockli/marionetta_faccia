let capture
let detector

let occhiochiuso
let occhioDx
let occhioSx
let sfondoScuro = false;
let bocca
let boccaaperta
let occhioSxaperto // occhio spalancato
let occhioDxaperto // occhio spalancato

async function preload() {

    occhiochiuso = loadImage('img/01.png');
    occhioDx = loadImage('img/02.png');
    occhioSx = loadImage('img/03.png')
    bocca = loadImage('img/04.png')
    boccaaperta = loadImage('img/05.png')
	occhioDxaperto = loadImage('img/06.png')
	occhioSxaperto = loadImage('img/07.png')
  }

async function setup() {
  
    createCanvas(640, 480)

    capture = createCapture(VIDEO)
    capture.size(640, 480)
    capture.hide()
    
    console.log("Carico modello...")
    detector = await createDetector()
    console.log("Modello caricato.")

}

async function draw() {

    background(255)

    // noStroke()
    // fill(255, 10)
    // rect(0, 0, width, height) 

    // Disegna la webcam sullo stage, a specchio
    // push()
    // scale(-1, 1)
    // image(capture, -640, 0)
    // pop()

    // SFONDO SCURO
    if (sfondoScuro) {
        background(50) // Imposta lo sfondo su grigio scuro
      } else {
        background(255) // Imposta lo sfondo su bianco
      }
    

    if (detector && capture.loadedmetadata) {
        
        const hands = await detector.estimateHands(capture.elt, { flipHorizontal: true })

        if (hands.length == 1) {
        
            const mano = hands[0]

            const indice  = mano.keypoints[8]
            const mignolo = mano.keypoints[20]
            const pollice = mano.keypoints[4]
            const medio = mano.keypoints[12]
            const posMedia = createVector((indice.x + mignolo.x) / 2, (indice.y + mignolo.y) / 2)
            const ditaSeparate = dist(indice.x, indice.y, mignolo.x, mignolo.y) < 200

            const distPolliceMedio = dist(medio.x, medio.y, pollice.x, pollice.y)


            if (ditaSeparate) {
              image(occhiochiuso, indice.x-150, indice.y-150, 250, 250)
              image(occhiochiuso, mignolo.x-150, mignolo.y-150, 250, 250)
            } else {
              if (posMedia.x < width/2) {
                image(occhioSx, indice.x-150, indice.y-150, 250, 250)
                image(occhioSx, mignolo.x-150, mignolo.y-150, 250, 250)
              } else {
                image(occhioDx, indice.x-150, indice.y-150, 250, 250)
                image(occhioDx, mignolo.x-150, mignolo.y-150, 250, 250)
              }
              // image(bocca, pollice.x-150, pollice.y-150, 250, 250)
            }

			if (distPolliceMedio < 50){
				if(posMedia.x < width/2) {
					background(255)
					image(boccaaperta, medio.x-150, medio.y-150, 250, 250)
					image(occhioSxaperto, indice.x-150, indice.y-150, 250, 250)
					image(occhioSxaperto, mignolo.x-150, mignolo.y-150, 250, 250)
				} else {
					background(255)
					image(boccaaperta, medio.x-150, medio.y-150, 250, 250)
					image(occhioDxaperto, indice.x-150, indice.y-150, 250, 250)
					image(occhioDxaperto, mignolo.x-150, mignolo.y-150, 250, 250)
				}
			} else {
				image(bocca, pollice.x-150, pollice.y-150, 250, 250)
			}
        }   
    }
}


    function mouseClicked() {
        sfondoScuro = !sfondoScuro; // Inverti il valore di sfondoScuro
    }

async function createDetector() {
    // Configurazione Media Pipe
    // https://google.github.io/mediapipe/solutions/hands
    const mediaPipeConfig = {
        runtime: "mediapipe",
        modelType: "full",
        maxHands: 1,
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`,
    }
    return window.handPoseDetection.createDetector( window.handPoseDetection.SupportedModels.MediaPipeHands, mediaPipeConfig )
}

