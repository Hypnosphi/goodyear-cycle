import {Stream} from 'xstream';
import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/xstream-typings';
import {StateSource} from 'cycle-onionify';

export type Reducer<State> = (prev?: State) => State | undefined;

export type Reducer$<State> = Stream<Reducer<State>>;

export interface Sources<State> {
    onion: StateSource<State>,
    DOM: DOMSource,
}

export interface Sinks<State> {
    onion: Reducer$<State>,
    DOM: Stream<VNode>,
}

type Component<State> = (sources: Sources<State>) => Sinks<State>;
export default Component;
