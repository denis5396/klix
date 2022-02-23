import React, { useRef } from "react";
import s from "./ReportComment.module.css";

const ReportComment = (props) => {
  const choiceRef = useRef();
  const closeModal = () => {
    props.closeModal(null);
  };

  const sendReport = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    console.log(month);
    console.log(day);
    console.log(props.reportData);
    console.log(choiceRef.current.style);
    let inputs = [];
    let commentData = props.reportData;
    for (let i = 0; i < choiceRef.current.children.length; i++) {
      if (choiceRef.current.children[i].children[0].checked) {
        inputs.push(choiceRef.current.children[i].children[0]);
      }
    }
    if (!inputs.length) {
      alert("Molimo, odaberite razlog prijave.");
    } else {
      commentData.reason = inputs[0].value;
      fetch(
        `https://klix-74c29-default-rtdb.europe-west1.firebasedatabase.app/reports/${year}/${month}/${day}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commentData),
        }
      );
      props.closeModal(null);
    }
  };

  return (
    <div id={s.reportContainer}>
      <div id={s.reportHeader}>
        <h3>Navedite razlog zbog kojeg želite prijaviti ovaj komentar?</h3>
      </div>
      <div id={s.reportBody}>
        <div id={s.reportRadioBtns} ref={choiceRef}>
          <div className={s.bundleRadios}>
            <input
              type="radio"
              id="reportChoice1"
              name="report"
              value="govor mržnje"
              readonly="readonly"
            />
            <label htmlFor="reportChoice1">Govor mržnje</label>
          </div>
          <div className={s.bundleRadios}>
            <input
              type="radio"
              id="reportChoice2"
              name="report"
              value="negiranje genocida"
              readonly="readonly"
            />
            <label htmlFor="reportChoice2">Negiranje genocida</label>
          </div>
          <div className={s.bundleRadios}>
            <input
              type="radio"
              id="reportChoice3"
              name="report"
              value="neprikladan rječnik"
              readonly="readonly"
            />
            <label htmlFor="reportChoice3">Neprikladan rječnik</label>
          </div>
          <div className={s.bundleRadios}>
            <input
              type="radio"
              id="reportChoice4"
              name="report"
              value="off topic"
              readonly="readonly"
            />
            <label htmlFor="reportChoice4">Off topic</label>
          </div>
          <div className={s.bundleRadios}>
            <input
              type="radio"
              id="reportChoice5"
              name="report"
              value="vrijeđanje"
              readonly="readonly"
            />
            <label htmlFor="reportChoice5">Vrijeđanje</label>
          </div>
          <div className={s.bundleRadios}>
            <input type="radio" id="reportChoice6" name="report" value="spam" />
            <label htmlFor="reportChoice6">Spam</label>
          </div>
          <div className={s.bundleRadios}>
            <input
              type="radio"
              id="reportChoice7"
              name="report"
              value="reklama"
              readonly="readonly"
            />
            <label htmlFor="reportChoice7">Reklama</label>
          </div>
        </div>
        <div id={s.confirm}>
          <button onClick={closeModal}>Odustani</button>
          <button onClick={sendReport}>Prijavi komentar</button>
        </div>
        <p id={s.footerNote}>
          Ukoliko želite dopuniti vašu prijavu ili prijaviti određenog korisnika
          molimo da nas kontaktirate na poseban e-mail: komentari@klix.ba.
        </p>
      </div>
    </div>
  );
};

export default ReportComment;
