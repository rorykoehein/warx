import 'rxjs';
import shoot from '../lib/sound/shoot.wav';
import hit from '../lib/sound/hit.wav';

// https://freesound.org/people/Kastenfrosch/sounds/162472/
// https://freesound.org/people/Kastenfrosch/sounds/162466/
// https://freesound.org/people/Kastenfrosch/sounds/162461/
// https://freesound.org/people/Kastenfrosch/sounds/162466/

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
