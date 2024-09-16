// import companyLogo "../assets/book.png";
import { Link } from "react-router-dom";
export function AppLogo(props: { className?: string }) {
  /* Logo */

  return (
    <Link
      to="/"
      {...props}
      className={"pt-2 flex items-center gap-1 " + props.className}
    >
      <svg width={128} height={72} viewBox="0 0 1940 828">
        <path
          transform="translate(87,137)"
          d="m0 0h296l1 1v349l-1 8-261 1-13 2-10 4-11 8-7 11-4 13v19l3 12 6 11 8 8 14 8 7 2 8 1 298 1v-389h21l1 1v415l-110 1h-204l-17-1-14-4-16-8-13-11-7-8-7-12-5-14-2-12v-379l4-11 7-11 10-9 10-5z"
          fill="#BC231F"
        />
        <path
          transform="translate(582,761)"
          d="m0 0h432l849 1 20 1v22l-1 1-486 1-1347-1v-23l458-1z"
          fill="#CFD0D0"
        />
        <path
          transform="translate(853,380)"
          d="m0 0h83l18 2 16 5 9 5 10 9 7 10 5 13 3 16 1 15v16l-2 19-5 15-6 10-5 6-10 7-5 1 5 5 11 7 7 7 7 11 5 14 2 12 1 11v37l-3 22-6 15-6 9-9 10-11 7-13 5-15 3-16 1h-78l-1-1v-323zm50 46v86h28l9-3 6-4 5-8 2-8 1-9v-22l-2-16-4-8-5-5-7-3zm0 132v100h36l10-4 7-8 3-14v-39l-2-15-4-10-8-7-9-3z"
          fill="#181E6C"
        />
        <path
          transform="translate(1510,380)"
          d="m0 0h84l17 2 17 5 10 6 7 6 9 13 5 13 3 18v51l-3 16-5 12-8 11-10 9-7 2 3 3 11 7 7 7 7 14 3 9 2 11 1 15 1 74 2 12 2 8-3 1h-47l-3-2-2-8-1-10-1-74-2-17-4-10-6-7-8-3-6-1-24-1v132l-6 1h-44l-1-1zm51 46v100h30l10-5 6-7 4-13v-52l-2-9-5-8-5-4-5-2z"
          fill="#1A206D"
        />
        <path
          transform="translate(1072,380)"
          d="m0 0h85l17 2 16 5 10 6 7 6 8 11 5 12 3 13 1 9v48l-2 14-4 12-7 12-9 9-6 4-5 1 3 3 11 7 8 9 6 12 4 14 1 7 1 21 1 64 2 15 2 8-2 1h-47l-3-1-3-9-1-7-1-79-2-16-4-9-6-7-9-3-5-1-24-1v132l-10 1h-39l-2-1zm51 46v100h30l10-5 6-7 3-7 1-6v-53l-3-10-4-6-5-4-5-2z"
          fill="#191F6C"
        />
        <path
          transform="translate(1329,380)"
          d="m0 0h73l2 4 10 63 12 75 12 76 16 99 1 7-8 1h-42l-2-1-6-38-2-15v-5h-63l-6 43-2 14-3 2h-42l-3-1 1-7 24-150 13-82 12-74 2-10zm32 58-5 39-12 83-6 42h49l-1-14-17-116-4-25-2-9z"
          fill="#191F6C"
        />
        <path
          transform="translate(1707,380)"
          d="m0 0h52l3 7 19 74 15 57 1 9 2-1 21-81 11-41 6-23 1-1h48l-2 9-12 40-19 64-22 74-8 27-1 110-3 1h-47l-1-1-1-107-9-31-22-74-14-47-18-61z"
          fill="#191F6C"
        />
        <path
          transform="translate(717,60)"
          d="m0 0h41l1 1v113h47v-113l1-1h41l1 1v264l-1 1h-41l-1-57v-55l1-2h-48v113l-2 1h-39l-1-1z"
          fill="#191F6C"
        />
        <path
          transform="translate(1582,60)"
          d="m0 0h41v114l47-1 1-113h41l1 1v264l-1 1h-40l-1-1-1-98v-11l1-4h-48v113l-1 1h-40l-1-1v-264z"
          fill="#181E6C"
        />
        <path
          transform="translate(1459,57)"
          d="m0 0h17l12 2 12 5 11 8 8 10 5 11 3 11 1 9 1 36-2 1h-37l-1-1-1-35-3-10-4-5-6-3h-16l-6 4-4 5-2 7v161l3 10 5 4 7 3h11l10-5 4-8 1-7v-54h-17l-1-1v-37h58l1 1v45l-1 49-2 13-5 14-9 12-8 7-16 7-9 2-16 1-19-3-12-5-6-4-7-6-7-10-5-13-2-9-1-10v-156l3-15 5-13 6-9 8-8 14-7 12-3z"
          fill="#191F6C"
        />
        <path
          transform="translate(544,380)"
          d="m0 0h51v278h84v46l-2 1h-132l-1-1z"
          fill="#181E6C"
        />
        <path
          transform="translate(906,60)"
          d="m0 0h113v37l-2 1h-70v74h57v37l-2 1h-55v78h72v37l-2 1h-111l-1-1v-264z"
          fill="#191F6C"
        />
        <path
          transform="translate(733,380)"
          d="m0 0h51v324l-3 1h-48l-1-316z"
          fill="#181E6C"
        />
        <path
          transform="translate(545,60)"
          d="m0 0h127l1 1v36l-1 1h-43l1 2v225l-2 1h-39l-1-1v-227h-43l-1-1v-36z"
          fill="#1A206D"
        />
        <path
          transform="translate(1757,60)"
          d="m0 0h128l1 1v36l-2 1-41 1v226l-3 1h-38l-1-1-1-226-42-1-1-1z"
          fill="#181E6C"
        />
        <path
          transform="translate(1156,60)"
          d="m0 0h40l1 1v227h68l1 1v36l-2 1h-108l-1-1v-264z"
          fill="#1B216D"
        />
        <path
          transform="translate(1310,60)"
          d="m0 0h41l1 3v261l-2 2h-40l-1-6v-258z"
          fill="#1A206D"
        />
        <path
          transform="translate(130,534)"
          d="m0 0h252l1 1v20l-78 1h-173l-7-2-5-7 1-7 6-5z"
          fill="#BE2722"
        />
      </svg>
    </Link>
  );
}
