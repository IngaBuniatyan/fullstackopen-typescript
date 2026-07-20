import axios from 'axios';
import { useEffect, useState, type FormEvent } from 'react';
import diaryService from './services/diaries.ts';
import {
  Visibility,
  Weather,
  type DiaryEntry,
  type NewDiaryEntry,
} from './types.ts';

const errorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return 'An unexpected error occurred';
  }

  const responseData: unknown = error.response?.data;

  if (
    typeof responseData !== 'object'
    || responseData === null
    || !('error' in responseData)
  ) {
    return error.message;
  }

  const reason: unknown = responseData.error;

  if (typeof reason === 'string') {
    return reason;
  }

  if (Array.isArray(reason)) {
    const messages = reason.flatMap((issue: unknown) => {
      if (typeof issue !== 'object' || issue === null || !('message' in issue)) {
        return [];
      }

      const message = issue.message;
      const path =
        'path' in issue && Array.isArray(issue.path)
          ? issue.path.filter((part): part is string => typeof part === 'string')
          : [];

      return typeof message === 'string'
        ? [`${path.length > 0 ? `${path.join('.')}: ` : ''}${message}`]
        : [];
    });

    if (messages.length > 0) {
      return messages.join(', ');
    }
  }

  return 'The backend rejected the diary entry';
};

interface DiaryFormProps {
  onCreate: (entry: NewDiaryEntry) => Promise<void>;
}

const DiaryForm = ({ onCreate }: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather | ''>('');
  const [visibility, setVisibility] = useState<Visibility | ''>('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string>();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (weather === '' || visibility === '') {
      setError('weather and visibility are required');
      return;
    }

    try {
      await onCreate({ date, weather, visibility, comment });
      setDate('');
      setWeather('');
      setVisibility('');
      setComment('');
      setError(undefined);
    } catch (caughtError: unknown) {
      setError(errorMessage(caughtError));
    }
  };

  return (
    <section>
      <h2>Add new entry</h2>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={submit}>
        <div>
          <label>
            date{' '}
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>
        </div>

        <fieldset>
          <legend>weather</legend>
          {Object.values(Weather).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={() => setWeather(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>

        <fieldset>
          <legend>visibility</legend>
          {Object.values(Visibility).map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={() => setVisibility(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>

        <div>
          <label>
            comment{' '}
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </label>
        </div>
        <button type="submit">add</button>
      </form>
    </section>
  );
};

interface DiaryListProps {
  diaries: DiaryEntry[];
}

const DiaryList = ({ diaries }: DiaryListProps) => (
  <section>
    <h2>Diary entries</h2>
    {diaries.map((diary) => (
      <article key={diary.id}>
        <h3>{diary.date}</h3>
        <div>visibility: {diary.visibility}</div>
        <div>weather: {diary.weather}</div>
      </article>
    ))}
  </section>
);

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loadError, setLoadError] = useState<string>();

  useEffect(() => {
    void diaryService
      .getAll()
      .then(setDiaries)
      .catch((error: unknown) => setLoadError(errorMessage(error)));
  }, []);

  const createDiary = async (entry: NewDiaryEntry): Promise<void> => {
    const createdDiary = await diaryService.create(entry);
    setDiaries((currentDiaries) => currentDiaries.concat(createdDiary));
  };

  return (
    <main>
      <h1>Flight diaries</h1>
      {loadError && <p role="alert">{loadError}</p>}
      <DiaryForm onCreate={createDiary} />
      <DiaryList diaries={diaries} />
    </main>
  );
};

export default App;
