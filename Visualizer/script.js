myCanvas.width = 400;
myCanvas.height = 300;

const margin = 30;

let moves = [];
const n = 20;
const array = [];
const col = []; //columns to be represented

const spacing = (myCanvas.width-margin*2)/n; // set width columns

const ctx = myCanvas.getContext("2d"); //retreive context in canvas tag

const maxColHeight = 200;

let audioCtx = null;

function playNote(freq,wave){
    if(audioCtx == null){
        audioCtx=new(
            AudioContext||
            webkitAudioContext||
            window.webkitAudioContext
        )();
    }

    const dur = 0.2;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.type = wave;
    osc.stop(audioCtx.currentTime+dur);

    const node = audioCtx.createGain();
    node.gain.linearRampToValueAtTime(
        0,audioCtx.currentTime+dur
    );

    osc.connect(node);
    node.connect(audioCtx.destination);


}

function init(){

        for(let i = 0; i < n; i++){
            array[i] = Math.random();
        }
        moves = [];

        for(let i =0; i<array.length; i++){
            const x = i*spacing+spacing/2+margin;
        
            const y = myCanvas.height-margin-i*3;
        
            const width = spacing-4;
        
            const height = maxColHeight*array[i];
        
            col[i] = new Column(x,y,width,height);
        
            
        }
}
//Genrating Random Numbers in Array
function play(){
    moves = bubbleSort(array);
}




 

animate();


function bubbleSort(array){
    const moves = [];
        do{
            var swap = false;
            for(let i = 1; i < array.length; i++){
                if(array[i-1]>array[i]){
                    swap = true;
                    [array[i-1],array[i]] = [array[i],array[i-1]];
                    moves.push(
                        {indices:[i-1,i],swap:true}
                    );
                }
                else{
                    moves.push(
                        {indices:[i-1,i],swap:false}
                    );
                }
            }
        }while(swap);

        return moves;
}

function animate(){
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    let changed = false;
    for(let i = 0; i < col.length; i++){
       changed =  col[i].draw(ctx)||changed;
    }


    if(!changed && moves.length>0){
        const move = moves.shift();
        const [i,j] = move.indices;
        const wave = move.swap?"square":"sine"
        playNote(col[i].height+col[j].height,wave);

        if(move.swap){
            col[i].moveTo(col[j]);
            col[j].moveTo(col[i],-1);
            [col[i],col[j]] = [col[j],col[i]];
        }
        else{
            col[i].jump();
            col[j].jump();
        }
    }
    requestAnimationFrame(animate);
}
