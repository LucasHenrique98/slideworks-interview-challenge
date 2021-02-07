import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import css from './Styles/style.module.css';

function App() {
  const [tags, setTags] = useState([]);
  const [submittedData, setSubmittedData] = useState({});
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
    errors,
  } = useForm({ defaultValues: { something: 'anything' } });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ ...submittedData });
    }
  }, [isSubmitSuccessful, submittedData, reset]);

  async function onSubmit(data) {
    try {
      //Create a card with a name and a description
      await axios
        .post(
          `https://api.trello.com/1/cards?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&idList=${process.env.REACT_APP_ID_LIST}`,
          { name: data.name, desc: `${data.desc}` }
        )

        //Create a dropdown label
        .then(async (card) => {
          const cardId = card.data.id;
          await axios.post(
            `https://api.trello.com/1/cards/${cardId}/labels?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&color=red`,
            { name: data.dropdown }
          );

          //Create a email label
          await axios.post(
            `https://api.trello.com/1/cards/${cardId}/labels?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&color=blue`,
            { name: data.email }
          );

          //Create a tag label
          axios.post(
            `https://api.trello.com/1/cards/${cardId}/labels?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&color=green`,
            {
              name: `Tags: ${
                tags.length !== 0 ? tags.join(' - ') : 'Nenhuma Tag Adicionada'
              }`,
            }
          );

          //Create a checklist with the options
          await axios
            .post(
              `https://api.trello.com/1/checklists?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&idCard=${cardId}`,
              { name: 'Options' }
            )
            .then(async (checklist) => {
              const checkListId = await checklist.data.id;

              if (data.option1 === true) {
                await axios.post(
                  `https://api.trello.com/1/checklists/${checkListId}/checkItems?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&name=Option 1`,
                  { checked: data.option1 }
                );
              }
              if (data.option2 === true) {
                await axios.post(
                  `https://api.trello.com/1/checklists/${checkListId}/checkItems?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&name=Option 2`,
                  { checked: data.option2 }
                );
              }
              if (data.option3 === true) {
                await axios.post(
                  `https://api.trello.com/1/checklists/${checkListId}/checkItems?key=${process.env.REACT_APP_KEY}&token=${process.env.REACT_APP_TOKEN}&name=Option 3`,
                  { checked: data.option3 }
                );
              }
            });
        });

      setTags([]);
      reset(data);
      alert('Formulário enviado com sucesso');
    } catch (error) {
      alert('Erro ao enviar formulário');
      console.log(error);
    }
  }

  function addTag(event) {
    if (
      event.key === '+' &&
      event.target.value !== '' &&
      event.target.value !== '+'
    ) {
      setTags([
        event.target.value.toUpperCase().replace('+', '').replace(' ', ''),
        ...tags,
      ]);
      event.target.value = '';
    } else {
      event.preventDefault();
    }
  }

  return (
    <div className={css.container}>
      <h1 className={css.header}>Slideworks Challenge</h1>

      <div className={css.mainDiv}>
        <form className={css.formDiv} onSubmit={handleSubmit(onSubmit)}>
          <div className={css.leftDiv}>
            <strong>Name</strong>

            <input
              className={css.inputs}
              name="name"
              type="text"
              ref={register({
                required: true,
                pattern: {
                  value: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
                  message: 'Entered value does not match name format',
                },
              })}
            />
            {errors.name && (
              <span className={('error', css.errorMessage)}>Enter a name</span>
            )}
            <br />

            <strong>Email</strong>

            <input
              className={css.inputs}
              type="email"
              name="email"
              ref={register({
                required: 'Enter your e-mail',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Enter a valid e-mail address',
                },
              })}
            />
            {errors.email && (
              <p className={('error', css.errorMessage)}>
                {errors.email.message}
              </p>
            )}

            <br />

            <textarea
              className={css.textArea}
              name="desc"
              ref={register({ required: true })}
              placeholder="Type something"
            />
            {errors.desc && (
              <span className={css.errorMessage}>Enter a description</span>
            )}
          </div>

          <div className={css.rigthDiv}>
            <div className={css.optionsDiv}>
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                htmlFor="option1"
              >
                <input
                  ref={register}
                  className={css.checkbox}
                  name="option1"
                  type="checkbox"
                />
                Opção 1
              </label>

              <label className={css.optionsStyle} htmlFor="option2">
                <input
                  ref={register}
                  className={css.checkbox}
                  name="option2"
                  type="checkbox"
                />
                Opção 2
              </label>

              <label className={css.optionsStyle} htmlFor="option3">
                <input
                  ref={register}
                  className={css.checkbox}
                  name="option3"
                  type="checkbox"
                />
                Opção 3
              </label>
            </div>

            <div style={{ marginTop: '25px' }}>
              <strong>Dropdown</strong>
              <br />

              <select
                className={css.dropdown}
                ref={register({ required: true })}
                name="dropdown"
                id="dropdown"
              >
                <option value="Select 1">Select 1</option>
                <option value="Select 2">Select 2</option>
                <option value="Select 3">Select 3</option>
              </select>
            </div>

            <div className={css.tagsContainer}>
              <strong>Tags</strong>

              <div style={{ marginTop: '20px' }}>
                <div className={css.tagsField}>
                  {tags.map((tag, index) => {
                    return (
                      <span className={css.cardTag} key={index}>
                        {tag}
                      </span>
                    );
                  })}
                </div>
                <input
                  onKeyUp={addTag}
                  className={css.tagInputField}
                  type="text"
                  name="tags"
                  placeholder="Press Plus Button to add a Tag"
                />
              </div>
            </div>
            <button className={css.submitButton} type="submit">
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
