interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase {
  kind: 'group';
  groupProjectCount: number;
}

interface CoursePartBackground extends CoursePartWithDescription {
  kind: 'background';
  backgroundMaterial: string;
}

interface CoursePartSpecial extends CoursePartWithDescription {
  kind: 'special';
  requirements: string[];
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;

interface HeaderProps {
  name: string;
}

interface ContentProps {
  parts: CoursePart[];
}

interface PartProps {
  part: CoursePart;
}

interface TotalProps {
  parts: CoursePart[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled course part: ${JSON.stringify(value)}`);
};

const Header = ({ name }: HeaderProps) => <h1>{name}</h1>;

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case 'basic':
      return (
        <section>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <p>{part.description}</p>
        </section>
      );
    case 'group':
      return (
        <section>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <p>project exercises {part.groupProjectCount}</p>
        </section>
      );
    case 'background':
      return (
        <section>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <p>{part.description}</p>
          <p>submit to {part.backgroundMaterial}</p>
        </section>
      );
    case 'special':
      return (
        <section>
          <h2>
            {part.name} {part.exerciseCount}
          </h2>
          <p>{part.description}</p>
          <p>required skills: {part.requirements.join(', ')}</p>
        </section>
      );
    default:
      return assertNever(part);
  }
};

const Content = ({ parts }: ContentProps) => (
  <main>
    {parts.map((part) => (
      <Part key={part.name} part={part} />
    ))}
  </main>
);

const Total = ({ parts }: TotalProps) => (
  <p>
    Number of exercises{' '}
    {parts.reduce((sum, part) => sum + part.exerciseCount, 0)}
  </p>
);

const App = () => {
  const courseName = 'Half Stack application development';

  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part',
      kind: 'basic',
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: 'group',
    },
    {
      name: 'Basics of type Narrowing',
      exerciseCount: 7,
      description: 'How to go from unknown to string',
      kind: 'basic',
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      backgroundMaterial:
        'https://type-level-typescript.com/template-literal-types',
      kind: 'background',
    },
    {
      name: 'TypeScript in frontend',
      exerciseCount: 10,
      description: 'a hard part',
      kind: 'basic',
    },
    {
      name: 'Backend development',
      exerciseCount: 21,
      description: 'Typing the backend',
      requirements: ['nodejs', 'jest'],
      kind: 'special',
    },
  ];

  return (
    <>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts} />
    </>
  );
};

export default App;
