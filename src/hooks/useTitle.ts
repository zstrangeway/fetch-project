import { useEffect, useState } from "react";
import { AppStage } from "../services/logging-service";

const APP_STAGE = import.meta.env.VITE_APP_STAGE;

const getAppStageTitle = (title: string) =>
  APP_STAGE === AppStage.Prod ? title : `[${APP_STAGE}] ${title}`;

export default function useTitle(initialTitle: string) {
  const [title, setTitle] = useState(getAppStageTitle(initialTitle));
  const updateTitle = () => {
    const htmlTitle = document.querySelector("title");
    if (htmlTitle) {
      htmlTitle.innerText = title;
    }
  };
  useEffect(updateTitle, [title]);

  return setTitle;
}
