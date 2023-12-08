import utils from "./utils";
import RNA from "./RNA.js";
import controls from "./controls.js";

const SAMPLES = 20 //Numero de dino por cada geracao
const game = Runner.instance_;
let dinoList = []
let dinoIndex = 0

let bestScore = 0;
let bestRNA = null;

function fillDinoList () {
    for (let i=0; i < SAMPLES; i++) {
        dinoList[i] = new RNA(3, [10, 10, 2])
        dinoList[i].load(bestRNA)
        if (i > 0) dinoList[i].mutate(0.5)
    }
    console.log('Lista de dino criada')
}

setTimeout(() => {
    fillDinoList()
    controls.dispatch('jump')
}, 1000)

setInterval(() => {
    if (!game.activated) return

    const dino = dinoList[dinoIndex]

    if (game.crashed) { //salva o novo melhor score
        if (dino.score > bestScore) {
            bestScore = dino.score
            bestRNA = dino.save()
            console.log('Melhor pontuacao:', bestScore)
        }
        dinoIndex++

        if (dinoIndex === SAMPLES) {
            fillDinoList();
            dinoIndex = 0
            bestScore = 0
        }
        game.restart()
    }

    const {tRex, horizon, currentSpeed, distanceRan, dimensions} = game
    dino.score = distanceRan - 2000

    const player = {
        x: tRex.xPos,
        y: tRex.yPos,
        speed: currentSpeed
    };

    const [obstacle] = horizon.obstacles
    .map((obstacles) => {
        return{
            x: obstacle.xPos,
            y: obstacle.yPos
        }
    })
    .filter((obstacle) => obstacle.x > player.x)

    if (obstacle){
        const distance = 1 - (utils.getDistance(player, obstacle) / dimensions.WIDTH);
        const speed = player.speed / 6
        const height = Math.tanh(105 - obstacle.y)

        const [jump, crouch] = dino.compute([
            distance,
            speed, 
            height,
        ]);

        if (jump === crouch) return // condicoes e acoes
        if (jump) controls.dispatch('jump')
        if(crouch) controls.dispatch('crouch')
    };
}, 100);

/* const s = document.createElement('script');
s.type = 'module';
s.src = 'http://localhost:5500/script.js'
document.body.appendChild(s); */