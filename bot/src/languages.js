const strings = {
  uz: {
    welcome: "Xush kelibsiz! Bu terminal qo'llab-quvvatlash boti. / Добро пожаловать! Это бот поддержки терминала. / Welcome to the terminal support bot.",
    ask_atm: "Iltimos, terminal raqamini kiriting:",
    invalid_atm: "❌ Ko'rsatilgan raqamli terminal topilmadi. Iltimos, raqamni tekshirib, qaytadan kiriting:",

    ask_problem: "Iltimos, quyidagi muammolardan birini tanlang:",
    ask_problem_other: "Iltimos, muammoingizni batafsil yozib qoldiring:",

    problem_no_receipt: "🧾 Chek chiqmadi",
    problem_no_money: "💳 Mablag' kartaga tushmadi",
    problem_other: "✍️ Boshqa muammo",

    ask_amount: "Iltimos, terminalga kiritilgan summani ko'rsating (so'm):",
    invalid_amount: "❌ Summa noto'g'ri kiritildi. Iltimos, faqat raqamlardan foydalaning:",

    ask_card: "Iltimos, karta raqamingizning birinchi 4 ta raqamini kiriting:",
    invalid_card_first4: "❌ Noto'g'ri kiritildi. Iltimos, aniq 4 ta raqam kiriting:",

    ask_card_last4: "Iltimos, karta raqamingizning oxirgi 4 ta raqamini kiriting:",
    invalid_card_last4: "❌ Noto'g'ri kiritildi. Iltimos, aniq 4 ta raqam kiriting:",

    ask_phone: "Iltimos, quyidagi tugma orqali telefon raqamingizni ulashing:",
    invalid_phone: "❌ Iltimos, to'g'ri telefon raqamini kiriting yoki kontaktni yuboring:",

    success: "Rahmat! Arizangiz muvaffaqiyatli qabul qilindi. Tez orada mutaxassislarimiz siz bilan bog'lanadi."
  },

  ru: {
    welcome: "Xush kelibsiz! Bu terminal qo'llab-quvvatlash boti. / Добро пожаловать! Это бот поддержки терминала. / Welcome to the terminal support bot.",
    ask_atm: "Пожалуйста, укажите номер терминала:",
    invalid_atm: "❌ Терминал с указанным номером не найден. Пожалуйста, проверьте номер и введите его снова:",

    ask_problem: "Пожалуйста, выберите проблему из списка:",
    ask_problem_other: "Пожалуйста, опишите вашу проблему подробнее:",

    problem_no_receipt: "🧾 Чек не был выдан",
    problem_no_money: "💳 Средства не поступили на карту",
    problem_other: "✍️ Другая проблема",

    ask_amount: "Пожалуйста, укажите сумму, внесённую в терминал (сум):",
    invalid_amount: "❌ Сумма указана некорректно. Пожалуйста, используйте только цифры:",

    ask_card: "Пожалуйста, укажите первые 4 цифры номера вашей карты:",
    invalid_card_first4: "❌ Введено некорректно. Пожалуйста, укажите ровно 4 цифры:",

    ask_card_last4: "Пожалуйста, укажите последние 4 цифры номера вашей карты:",
    invalid_card_last4: "❌ Введено некорректно. Пожалуйста, укажите ровно 4 цифры:",

    ask_phone: "Пожалуйста, поделитесь номером телефона, нажав кнопку ниже:",
    invalid_phone: "❌ Пожалуйста, введите корректный номер телефона или отправьте контакт:",

    success: "Благодарим вас! Ваша заявка успешно принята. Наши специалисты свяжутся с вами в ближайшее время."
  },

  en: {
    welcome: "Xush kelibsiz! Bu terminal qo'llab-quvvatlash boti. / Добро пожаловать! Это бот поддержки терминала. / Welcome to the terminal support bot.",
    ask_atm: "Please enter the terminal number:",
    invalid_atm: "❌ No terminal was found with the specified number. Please verify the number and try again:",

    ask_problem: "Please select an issue from the list below:",
    ask_problem_other: "Please describe your issue in detail:",

    problem_no_receipt: "🧾 Receipt was not issued",
    problem_no_money: "💳 Funds were not credited to the card",
    problem_other: "✍️ Other issue",

    ask_amount: "Please specify the amount deposited into the terminal (UZS):",
    invalid_amount: "❌ The amount entered is invalid. Please use numeric characters only:",

    ask_card: "Please enter the first 4 digits of your card number:",
    invalid_card_first4: "❌ Invalid entry. Please enter exactly 4 digits:",

    ask_card_last4: "Please enter the last 4 digits of your card number:",
    invalid_card_last4: "❌ Invalid entry. Please enter exactly 4 digits:",

    ask_phone: "Please share your phone number using the button below:",
    invalid_phone: "❌ Please enter a valid phone number or share your contact:",

    success: "Thank you. Your request has been successfully received. Our specialists will contact you shortly."
  }
};

module.exports = strings;