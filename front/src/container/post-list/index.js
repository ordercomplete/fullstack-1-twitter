import {
  // useState,
  Fragment,
  useEffect,
  useReducer,
  lazy,
  Suspense,
  useCallback,
} from "react";

import Title from "../../component/title";
import Grid from "../../component/grid";
import Box from "../../component/box";

import PostCreate from "../post-create";

import { Alert, Skeleton, LOAD_STATUS } from "../../component/load";

import { getDate } from "../../util/getDate";

// import PostItem from "../post-item";

// import { useWindowListener } from "../../util/useWindowListener";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";

const PostItem = lazy(() => import("../post-item"));

export default function Container({ theme }) {
  const [state, dispatch] = useReducer(requestReducer, requestInitialState);

  const getData = useCallback(async () => {
    dispatch({ type: LOAD_STATUS.PROGRESS });
    try {
      const res = await fetch("http://localhost:4000/post-list");

      const data = await res.json();

      if (res.ok) {
        dispatch({
          type: REQUEST_ACTION_TYPE.SUCCESS,
          payload: convertData(data),
        });
      } else {
        dispatch({
          type: REQUEST_ACTION_TYPE.ERROR,
          payload: data.message,
        });
      }
    } catch (error) {
      dispatch({
        type: REQUEST_ACTION_TYPE.ERROR,
        payload: error.message,
      });
    }
  }, []);

  const convertData = (raw) => ({
    list: raw.list.reverse().map(({ id, username, text, date }) => ({
      id,
      username,
      text,
      date: getDate(date),
    })),

    isEmpty: raw.list.length === 0,
  });

  useEffect(() => {
    getData();
  }, []);

  return (
    <Grid>
      <Box>
        <Grid>
          <Title>Home</Title>
          <PostCreate
            onCreate={getData}
            placeholder="What is happening?!"
            button="Post"
          />
        </Grid>
      </Box>

      {state.status === LOAD_STATUS.PROGRESS && (
        <Fragment>
          <Box>
            <Skeleton />
          </Box>
          <Box>
            <Skeleton />
          </Box>
        </Fragment>
      )}

      {state.status === LOAD_STATUS.ERROR && (
        <Alert status={state.status} message={state.message} />
      )}

      {state.status === LOAD_STATUS.SUCCESS && (
        <Fragment>
          {state.data.isEmpty ? (
            <Alert message="Список постів пустий" />
          ) : (
            state.data.list.map((item) => (
              <Fragment key={item.id}>
                <Suspense
                  fallback={
                    <Box>
                      <Skeleton />
                    </Box>
                  }
                >
                  <PostItem {...item} />
                </Suspense>
              </Fragment>
            ))
          )}
        </Fragment>
      )}
    </Grid>
  );
}

// ### Опис подій, функцій, методів та властивостей

// #### 1. Стан та функції:
// 1. **status**:
//    - **Тип**: State
//    - **Опис**: Визначає статус операції: `null`, `LOAD_STATUS.PROGRESS`, `LOAD_STATUS.SUCCESS`, або `LOAD_STATUS.ERROR`.

// 2. **message**:
//    - **Тип**: State
//    - **Опис**: Повідомлення про помилки під час операцій.

// 3. **data**:
//    - **Тип**: State
//    - **Опис**: Дані про пости, отримані з сервера.

// 4. **getData()**:
//    - **Тип**: Функція
//    - **Дії**: Виконує запит на сервер для отримання списку постів. Обробляє отримані дані та встановлює відповідний статус.

// 5. **convertData()**:
//    - **Тип**: Функція
//    - **Дії**: Конвертує вхідні дані у відповідний формат через обернене сортування та додавання дати до постів.

// #### 2. Компоненти та візуальне відтворення:
// 1. **Відображення заголовку та форми створення поста**:
//    - Заголовок відображається за допомогою компонента `Title`.
//    - Форма для створення посту виводиться через `PostCreate`.

// 2. **Відображення постів**:
//    - Виведення списку постів після завантаження.
//    - Відображення індикатора завантаження (`Skeleton`) під час процесу завантаження.

// 3. **Відображення повідомлень про помилки**:
//    - Виведення повідомлення при помилці під час отримання даних.

// #### Загальний опис:
// Файл `Container.js` містить реалізацію компонента, який відображає домашню сторінку з можливістю створення постів та перегляду списку існуючих постів. Компонент взаємодіє з сервером для отримання та відображення інформації. Під час завантаження показується індикатор завантаження, а також можливі повідомлення про помилки.
