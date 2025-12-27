'use client'

import  { useState } from 'react';
import One from './componants/step_1';
import Two from './componants/step_2';
import Three from './componants/step_3';
const Advertiser_campaign = () => {
  const [step, setstep] = useState(1)
  const [adID, setAdID] = useState<string | null>(null);

    const next = () => {
        setstep ( step + 1)
    }
    const back = () => {
        setstep ( step - 1)
    }


    return (
        <>

            {step == 1 && (
               <One next={next} setAdID={setAdID} />
            )} 

            {step == 2 && (
               <Two next={next} back={back} adID={adID} />
            )}

            {step == 3 && (
            <Three next={next} back={back} adID={adID}/>
            )}

        </>
    );
};

export default Advertiser_campaign;