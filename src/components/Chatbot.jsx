import React from "react";
import Chatbot from "react-chatbot-kit";

import style from "./Chatbot.module.css";

import "react-chatbot-kit/build/main.css";

import { createChatBotMessage } from "react-chatbot-kit";

import ChatHead from "../chat_head.png";
import configJson from "../config/config.json";

const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    if (message.toLowerCase().includes("credit")) {
      actions.handleCreditCard();
    } else if (message.toLowerCase().includes("loan")) {
      actions.handleLoan();
    } else if (message.toLowerCase().includes("investment")) {
      actions.handleInvestment();
    } else if (message.toLowerCase().includes("balance")) {
      actions.handleBalance();
    } else {
      actions.handleRest();
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const genStatusMsg = (status) => {
    return `Current status is '${status}'`;
  };

  const handleCreditCard = () => {
    console.log(window.userService);

    const botMessages = [
      createChatBotMessage(
        "Credit card service is available. Nulla quis lorem ut libero malesuada feugiat. Nulla quis lorem ut libero malesuada feugiat."
      ),
    ];

    if (window.creditLimit || window.creditLimit === "0") {
      botMessages.push(
        createChatBotMessage(`Current credit limit is ${window.creditLimit}`)
      );
    }

    if (window.userService["1"]) {
      botMessages.push(
        createChatBotMessage(
          `A request has been raised to increase credit limit.${genStatusMsg(
            window.userService["1"].status
          )}`
        )
      );
    }

    if (window.userService["2"]) {
      botMessages.push(
        createChatBotMessage(
          `A request has been raised to deactivate credit card. ${genStatusMsg(
            window.userService["2"].status
          )}`
        )
      );
    }

    if (window.userService["3"]) {
      botMessages.push(
        createChatBotMessage(
          `A request has been raised for loan. ${genStatusMsg(
            window.userService["3"].status
          )}`
        )
      );
    }

    if (window.userService["2"]) {
      botMessages.push(
        createChatBotMessage(
          `A request has been raised for investment. ${genStatusMsg(
            window.userService["4"].status
          )}`
        )
      );
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, ...botMessages],
    }));
  };

  const handleLoan = () => {
    const botMessage = createChatBotMessage(
      "Something about loan. Nulla quis lorem ut libero malesuada feugiat. Nulla quis lorem ut libero malesuada feugiat."
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleInvestment = () => {
    const botMessage = createChatBotMessage(
      "Something about Investments. Nulla quis lorem ut libero malesuada feugiat. Nulla quis lorem ut libero malesuada feugiat."
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleBalance = () => {
    let botMessage;
    if (localStorage.getItem("userId")) {
      botMessage = createChatBotMessage(`Your balance is ${window.balance}`);
    } else {
      botMessage = createChatBotMessage("Please Login First");
    }

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const handleRest = () => {
    let botMessage;
    botMessage = createChatBotMessage(
      `Please provide one of the options from (credit card, loan, investment, balance)`
    );

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleCreditCard,
            handleLoan,
            handleInvestment,
            handleBalance,
            handleRest,
          },
        });
      })}
    </div>
  );
};

export default function ChatbotComp({ isOpen, toggle }) {
  const config = {
    initialMessages: [
      createChatBotMessage(
        `Hi! I'm your assistant. Please select from the following menu`
      ),
      createChatBotMessage(`1. Credit Card`),
      createChatBotMessage(`2. Loan`),
      createChatBotMessage(`3. Investment Services`),
    ],
    botName: "Bot",
    customStyles: {
      botMessageBox: {
        backgroundColor: "#376B7E",
      },
      chatButton: {
        backgroundColor: "#5ccc9d",
      },
    },
  };

  if (localStorage.getItem("userId"))
    config.initialMessages.push(createChatBotMessage(`4. Check Balance`));

  return (
    <div className={style.wrapper}>
      {!isOpen && (
        <div onClick={toggle} className={style.view}>
          <img
            src={ChatHead}
            alt="Chat Head"
            style={{
              border: "2px solid #3B536F",
              padding: "5px",
              borderRadius: "100px",
              boxShadow: "0px 10px 20px lightblue",
            }}
          />
        </div>
      )}

      {isOpen && (
        <>
          <span className={style.close} onClick={toggle}>
            Close &times;
          </span>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </>
      )}
    </div>
  );
}
