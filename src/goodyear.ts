import xs from 'xstream';
import * as moment from 'moment';
import {input} from '@cycle/dom';
import Component, {Reducer$} from './interfaces';

import formats from './formats';

moment.locale('ru');
type Moment = moment.Moment;

export interface State {
    date?: Moment,
    scrollDate?: Moment,
    parsedDate?: Moment,
    days?: Moment[],
    format?: string,
    formats?: string[],
}

export const Goodyear: Component<State> = sources => {
    const inputDOMSource = sources.DOM
        .select('.input');
    const inputReducer$: Reducer$<State> = inputDOMSource
        .events('input')
        .map((e: Event) => (<HTMLInputElement>e.target).value)
        .map(text => (state: State) => {
            const extendedFormats: string[] = [
                state.format || '',
                ...state.formats || [],
            ];
            const date = moment(text, extendedFormats);
            const parsedDate = date.isValid() ? date : null;
            return Object.assign({}, state, {
                parsedDate,
                scrollDate: parsedDate || state.scrollDate,
            });
        });

    const confirmReducer$: Reducer$<State> = xs.merge(
            inputDOMSource.events('keydown')
                .filter((e: KeyboardEvent) => e.key === 'Enter'),
            inputDOMSource.events('blur'),
        )
        .mapTo((state: State) => Object.assign({}, state, {
            date: state.parsedDate || state.date,
        }));

    const defaultReducer$: Reducer$<State> = xs.of((prevState: State = {}) => {
        const now: Moment = moment();
        return Object.assign({
            date: now,
            scrollDate: prevState.date || now,
            days: [],
            format: 'D MMMM YYYY г.',
            formats,
        }, prevState);
    });

    return {
        onion: xs.merge(
            defaultReducer$,
            inputReducer$,
            confirmReducer$,
        ),
        DOM: sources.onion.state$
            .map(({date, format = ''}) => input('.input', {
                props: {
                    value: date ? date.format(format) : ''
                }
            })),
    };
};
