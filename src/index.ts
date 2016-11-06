import xs from 'xstream';
import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/xstream-run';
import isolate from '@cycle/isolate';
import onionify from 'cycle-onionify';
import {Goodyear, State as GoodyearState} from './goodyear';

import Component from './interfaces';

interface State {
    goodyear?: GoodyearState
}

const main: Component<State> = sources => isolate(Goodyear, 'goodyear')(sources);

run(onionify(main), {
    DOM: makeDOMDriver('#app')
});