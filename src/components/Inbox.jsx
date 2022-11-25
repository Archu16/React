import style from "./Inbox.module.css";

const _Inbox = [
  {
    title: "You have a message",
    body: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Nulla porttitor accumsan tincidunt.",
  },
  {
    title: "You have a message again",
    body: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Nulla porttitor accumsan tincidunt.",
  },
  {
    title: "You have a message",
    body: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Nulla porttitor accumsan tincidunt.",
  },
];

export default function Inbox() {
  return (
    <div className={style.wrapper}>
      {_Inbox.map((inbox) => (
        <article>
          <div className={style.title}>{inbox.title}</div>
          <div className={style.body}>{inbox.body}</div>
        </article>
      ))}
    </div>
  );
}
