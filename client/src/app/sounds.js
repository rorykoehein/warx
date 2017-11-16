import 'rxjs';
import shoot from '../lib/sound/shoot.wav';
import hit from '../lib/sound/hit.wav';

const actionSoundMap = {
    SHOT_FIRED: new Audio(shoot),
    HIT: new Audio(hit),
};

const sounds = (action$) => {
    return action$
        .do(({ type }) => {
            const sound = actionSoundMap[type];
            if(sound) {
                sound.play();
            }
        })
        .ignoreElements();

};

export default sounds;
