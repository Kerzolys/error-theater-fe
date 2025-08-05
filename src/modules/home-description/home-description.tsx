import descriptionImg from "./assets/homeDescriptionImage.jpeg";
import styles from "./home-description.module.scss";

export const HomeDescription = () => {
  return (
    <div id="info" className={styles.container}>
      <div className={styles.container__info}>
        <div className={styles.line}></div>
        <p>
          Errortheater ist eine Musiktheaterkompanie für provozierte
          Missverständnisse. Die Dramaturgie unserer Stücke erlaubt eine
          Arbeitsweise, die Veränderungen, Anpassungen und Entwicklungen nicht
          ausschließt, sondern sie zum inszenatorischen und kompositorischen
          Prinzip macht. Errortheater moduliert vorgefundene Situationen und
          setzt (Irr-)Lichter zur unverantwortlichen
        </p>
        <p>
          {" "}
          Lenkung des Blicks. Unser Ziel ist es, unter dem Zeichen der Musik
          Sensibilisierungen herzustellen für Vorgänge, Aktionen und Klänge, die
          sonst aus dem Raster der Kategorien und Aufmerksamkeit fallen. Wir
          komponieren alles, Dinge, Situationen etc. Text ist musikalisches
          Material, ebenso wie Ton oder Scheinwerfer: Alles wird benutzt,
          geformt nach den Gesetzen der begriffslosen Musik.
        </p>
        <p>
          {" "}
          2016 von Komponisten Alexander Chernyshkov gegründet und seit 2020 mit
          Philipp Lossau kollaborierend, hat Errortheater sich bereits mit
          zahlreichen Prod- und Destruktionen bei Festivals wie Biennale di
          Venezia, Steirischer Herbst, Musiktheatertage Wien, und Häusern wie
          Radiokulturhaus Wien und Elektrotheater Stanislawski Moskau
          eingenistet. Wiederkehrende Akteur:innen arbeiten
        </p>
        <p>
          {" "}
          in immer neuen und erweiterten Konstellationen an produktiven und
          störanfälligen Begegnungen.
        </p>
        <div className={styles.line}></div>
      </div>
      <div className={styles.container__image}>
        <img src={descriptionImg} alt="Error Theater Image" />
      </div>
    </div>
  );
};
