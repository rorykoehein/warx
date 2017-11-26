import 'rxjs';
import spawn from '../sounds/spawn.mp3';
import laser from '../sounds/laser.mp3';
import explode from '../sounds/explode.mp3';

const actionSoundMap = {
    SHOT_FIRED: {
        delay: 0,
        audio: new Audio(laser),
        volume: 1
    },
    EXPLOSION_ADDED: {
        delay: 200,
        audio: new Audio(explode),
        volume: 1,
    },
    SPAWN: {
        delay: 600,
        audio: new Audio(spawn),
        volume: .3,
    },
};

const sounds = (action$) => {
    return action$
        .do(({ type }) => {
            const config = actionSoundMap[type];
            if(config) {
                const { delay, audio, volume } = config;
                audio.volume = volume;
                setTimeout(() => audio.play(), delay);
            }
        })
        .ignoreElements();

};

export default sounds;
