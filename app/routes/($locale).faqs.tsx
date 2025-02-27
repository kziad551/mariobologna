import {Link, NavLink} from '@remix-run/react';
import {AnimatePresence, motion} from 'framer-motion';
import {TFunction} from 'i18next';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {IoIosArrowDown} from 'react-icons/io';
import {useCustomContext} from '~/contexts/App';

export const questions = [
  {
    id: 1,
    question: 'I have received a wrong item',
    answer:
      'If you receive the wrong item, Please contact our customer care team via email customercare@mariobologna.net',
  },
  {
    id: 2,
    question: 'I have a missing item in my order',
    answer:
      'For any missing items in your order, Please contact our customer care team via email customercare@mariobologna.net',
  },
  {
    id: 3,
    question: 'I have received a damaged item',
    answer:
      'If you receive a damaged item, Please contact our customer care team via email customercare@mariobologna.net',
  },
  {
    id: 4,
    question: 'How do I place an order as a gift?',
    answer:
      'You can add a gift note to any order through your cart on the My Bag page, by pressing on the Add Your Gift Note section. If you would like to add a note after you made your order, simply contact our customer care team via email customercare@mariobologna.net',
  },
  {
    id: 5,
    question: 'How can I undo an order cancellation?',
    answer:
      'We offer a "no questions asked" free-returns policy which allows you to return delivered items to us for any reason up to 30 days after the delivery of your Order, free of charge.',
  },
  {
    id: 6,
    question: 'How do I search for a specific item?',
    answer:
      'The search bar allows you to search by brand, keyword, Product ID or description. The bar can be found on the top-left corner of the website, or at the top of the homepage on the app.',
  },
  {
    id: 7,
    question: 'How will I know if an item is out-of-stock?',
    answer:
      "Any item that is sold out will mention Sold Out on the product page. In rare cases, a product in your cart may become out of stock as you're in the check-out process and a notification will pop-up during the process. For out-of-stock items, keep them saved in your wishlist in case they come back in stock.",
  },
  {
    id: 8,
    question: 'Are gift cards available?',
    answer:
      "Currently, gift cards aren't available. However, we are working to add this feature so stay tuned! For more on gifting and rewards, please see the Amber Card section.",
  },
  {
    id: 9,
    question: 'Where does Mario Bologna ship to?',
    answer:
      "Mario Bologna delivers across the GCC, with the delivery methods outlined below. We're constantly striving to improve your experience and are working on introducing more delivery methods across our channels.",
  },
  {
    id: 10,
    question: 'How do I make a purchase?',
    answer:
      "Simply browse the site, click on the desired item then click on the Add to Bag button. The item will then be in your cart, which you can visit by clicking on the bag icon on the top-right corner on desktop or at the bottom of the app. Continue shopping and once you're ready to place your order, revisit your cart and press on Secure Checkout. Follow the simple prompts to complete the checkout process.",
  },
  {
    id: 11,
    question: 'How will I know if Mario Bologna has received my order?',
    answer:
      'After placing your order, you will receive an e-mail to inform you that your order has been received. However, this does not mean that your order has been confirmed. If paying by payment card or PayPal, your order will only be accepted once your card details or PayPal payment have been approved, the delivery address has been verified and the items are located and shipped. From here, you will then receive a second e-mail from us confirming your order. In the event of a problem, however, you will quickly be informed and your payment will not be processed. For all Cash on Delivery orders, a courtesy call will be made to confirm your address and telephone number. Your items will then be dispatched.',
  },
  {
    id: 12,
    question:
      'Can I change or amend the items in my order once it has been placed?',
    answer:
      "Currently, this service is not available. To change or add an item, the order has to be cancelled or another order has to be made. However, we're working on developing this option, so stay tuned.",
  },
  {
    id: 13,
    question: 'Am I able to place an order via telephone?',
    answer:
      'Yes, however, this option is only available in the UAE and for Cash on Delivery payments, simply contact our customer care team via email customercare@mariobologna.net',
  },
  {
    id: 14,
    question: 'Is there a cost for duties and tax?',
    answer: 'No, we do not charge any duties or customs tax.',
  },
  {
    id: 15,
    question: 'Can I ship an order to multiple addresses?',
    answer: 'No, we can currently only ship to one address per order.',
  },
  {
    id: 16,
    question:
      'An item I want is out of stock, when will it become available again?',
    answer:
      "Although items do come back in stock, product availability depends on the brand's stock so we cannot identify when an item will be back on the website. To keep track, simply add the item to your wishlist and subscribe to our newsletters to stay updated. You can also check the New In section every Monday for all new additions. Items that are restocked will feature the Back in Stock tag.",
  },
  {
    id: 17,
    question:
      'Do the items come in Mario Bologna packaging or brand packaging?',
    answer:
      "This depends on the item and the brand, the packaging is specified on the product's page under the description.",
  },
  {
    id: 18,
    question:
      'I have placed an order and the amount was deducted, but I did not receive an order confirmation.',
    answer:
      "We are sorry to hear that, please wait 10 minutes as it may be a delay from our system. If you still haven't received your confirmation with your invoice, please contact our Customer Care team through the Contact Us page.",
  },
  {
    id: 19,
    question: 'What does Pre-Order Mean?',
    answer:
      "Get early access to coveted collections ahead of the official launch. Pre-ordering ensures that you will secure the item before it sells out. Once your order is placed, we will deliver it to you as soon as it's available.",
  },
  {
    id: 20,
    question: 'When do I need to pay for my item?',
    answer:
      'All Pre-Order items must be paid for in full at the time of placing the order.',
  },
  {
    id: 21,
    question: 'Which payment methods can I use for Pre-Order items?',
    answer:
      "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Cash on Delivery and online store credit. We also offer a payment in instalments option via third party providers (each a 'Delayed Payment Provider') subject to you meeting the Delayed Payment Provider's eligibility criteria and entering into a contract with the Delayed Payment Provider. Cash on Delivery is permitted for Orders of up to 50,000 AED.",
  },
  {
    id: 22,
    question: 'When can I expect to receive my order?',
    answer:
      'A tracking number will be provided by SMS once your order is confirmed. You will then be able to use the tracking number to track your order by contacting the customer care team email customercare@mariobologna.net',
  },
  {
    id: 23,
    question: 'Is Pre-Order Available in all regions?',
    answer:
      'Yes, Pre-Order is available in all regions we currently ship to (across the GCC)',
  },
  {
    id: 24,
    question: 'How can I track the status of my Pre-Order item?',
    answer:
      'The above table of delivery times does not apply to Pre-Orders. Your item will be shipped according to the expected release date, as indicated on the product page of the item.',
  },
  {
    id: 25,
    question: 'How will I know when the item has been shipped?',
    answer: '',
  },
  {
    id: 26,
    question:
      'What happens if I want to cancel my order before I have received it?',
    answer:
      'You can cancel your Pre-Order item at any time. Simply visit the My Orders section on the app. Please note that in the case of Pre-Order items the only mode of refund is store credit, the refund order value will be credited to your Mario Bologna store credit account and will not be transferred to your issuing bank for Debit/Credit card/Apple Pay accounts. You will not see a refund on your bank statement as we will be crediting the money on your Mario Bologna store credit account, and you can use this money for your future purchases on Mario Bologna.',
  },
  {
    id: 27,
    question:
      'What happens if I want to return my order after I have received it?',
    answer:
      'You can cancel your Pre-Order item within 30 days of receiving it. Simply visit the My Orders section on the app. Please note that in the case of Pre-Order items the only mode of refund is store credit, the refund order value will be credited to your Mario Bologna store credit account and will not be transferred to your issuing bank for Debit/Credit card/Apple Pay accounts. You will not see a refund on your bank statement as we will be crediting the money on your Mario Bologna store credit account, and you can use this money for your future purchases on Mario Bologna.',
  },
  {
    id: 28,
    question: 'How do I use my store credit?',
    answer:
      'To use your store credit balance you can follow these steps: log into your account, add your desired items to cart and visit your shopping bag. There, select the option to use your store credit balance then proceed to the checkout. Your amount will automatically be deducted from the total cost of your order. For more help, feel free to call our Customer Care team.',
  },
  {
    id: 29,
    question: 'What payment methods does Mario Bologna accept?',
    answer:
      "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Cash on Delivery and online store credit. We also offer a payment in instalments option via third party providers (each a 'Delayed Payment Provider') subject to you meeting the Delayed Payment Provider's eligibility criteria and entering into a contract with the Delayed Payment Provider. Cash on Delivery is permitted for Orders of up to 50,000 AED. You have the option to convert your purchases into monthly instalments subject to the Terms & Conditions of your bank. This option will be made available to you at the time of Secure Checkout where you can select the period of time over which you want to spread the payments for the purchase along with any fees or interest, if applicable.",
  },
  {
    id: 30,
    question: 'Why is my payment declined?',
    answer:
      "This may happen for a few reasons, like the CVV number not matching your card, the card number is wrong, or that your card has insufficient funds. In these cases, you will see an instant message on your order review screen. If the error persists, please contact your bank to see if there's an issue with your card.",
  },
  {
    id: 31,
    question: 'Why is the promo code not working?',
    answer:
      'Promotional codes are valid only in accordance with their terms, until the date stated, are not redeemable for cash and cannot be used in conjunction with any other offer, sale or promotion. Some codes are also only available for a single use.',
  },
  {
    id: 32,
    question: 'Can I use more than one discount?',
    answer: 'Unfortunately, you can only use one code at a time.',
  },
  {
    id: 33,
    question: 'Can you refund the price difference?',
    answer:
      'If an item you purchase goes on sale within 5 days of your purchase, your item qualifies for the discounted price. Please note, the item must be in the same size and color that was purchased. The difference between the purchase price and the sale price will be provided through a coupon code with no exclusions or expiry. Sale items with further reductions do not qualify for Price Difference. To claim the discount, contact us through our Contact Us page. Want to learn more about bank instalment payments using Tabby & Postpay? Visit their pages: Tabby: https://tabby.ai Postpay https://postpay.io',
  },
  {
    id: 34,
    question: 'How do instalments work?',
    answer:
      'You have the option to convert your purchases into monthly instalments subject to the Terms & Conditions of your bank. This option will be made available to you at the time of Secure Checkout where you can select the period of time over which you want to spread the payments for the purchase along with any fees or interest, if applicable. Please note that if you return or cancel an item where you have opted to break the purchase price into installments, then you must contact your bank to cancel the instalment plan or address any processing fees that may apply.',
  },
  {
    id: 35,
    question: 'Are bank instalment payments available across all countries?',
    answer:
      'No, bank instalment payments plans are currently only available on orders placed in the UAE and KSA.',
  },
  {
    id: 36,
    question:
      'Can I use the bank instalment payments plan with purchases made via prepaid cards or Cash on Delivery?',
    answer:
      'No, bank instalment payments plan are only available on purchases made via credit cards.',
  },
  {
    id: 37,
    question:
      'Which credit cards are eligible for bank instalment payments plans?',
    answer:
      'Please see the Partner Banks list on the Instalments Guide page for more information.',
  },
  {
    id: 38,
    question:
      'For bank instalment payments, how long will it take for the bank to process my request?',
    answer:
      'After you complete your order with us, it will take 2 days to send your information to your bank. An additional 3-5 working days will be taken by your bank to convert the amount into instalments. A total of 5-7 days will be required for the purchase to show up on your credit card statement. If the bank instalment payments plan is converted by your bank, you will also receive an SMS confirmation from them.',
  },
  {
    id: 39,
    question:
      'What will happen if I cancel an order placed with a bank instalment payments plan?',
    answer:
      'Please note that if you return or cancel an item where you have opted to break the purchase price into installments, then you must contact your bank to cancel the instalment plan or address any processing fees that may apply.',
  },
  {
    id: 40,
    question: 'How can I get details about my bank instalment payments plan?',
    answer:
      'Please communicate with your bank for more details about your bank instalment payments plan. To find out which purchases were made on instalment, please visit the Order Details page under My Account, where you will be able to see your selected instalment plans under Payment Information.',
  },
  {
    id: 41,
    question: 'How do I pay using Apple Pay?',
    answer:
      'We now accept Apple Pay to facilitate payment on our app and devices that support Apple Pay. If you are using Apple Pay on a Mac device, you will only see this payment option available on Safari browsers whilst using iOS. You can pay with Apple Pay using a Visa, Mastercard or American Express. To pay using Apple Pay, add the items to your bag and when you are ready to place your order, select Apple Pay at checkout.',
  },
  {
    id: 42,
    question: 'How do I select a payment currency?',
    answer:
      "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Cash on Delivery and online store credit. We also offer a payment in instalments option via third party providers (each a 'Delayed Payment Provider') subject to you meeting the Delayed Payment Provider's eligibility criteria and entering into a contract with the Delayed Payment Provider.",
  },
];

const FAQs = () => {
  const {setCurrentPage} = useCustomContext();
  const [active, setActive] = useState<{[x: number]: boolean}>({});
  const {t} = useTranslation();

  useEffect(() => {
    setCurrentPage('FAQs');
  }, []);

  return (
    <div className="faqs">
      <div className="py-3 px-4 sm:py-36 sm:px-8 flex flex-col items-stretch justify-start gap-8 sm:gap-18">
        <div className="flex flex-col gap-6">
          <h1 className="text-5xl font-medium hidden sm:block">{t('FAQs')}</h1>
        </div>
        <QuestionSection
          questions={questions}
          t={t}
          active={active}
          setActive={setActive}
        />
        <div className="flex flex-col items-start gap-6">
          <h2 className="text-3xl">{t('Still have a question?')}</h2>
          <Link
            className="w-fit px-6 py-2.5 font-medium text-sm bg-primary-P-40 text-white border border-transparent rounded-md"
            to="mailto:customercare@mariobologna.net"
            target="_blank"
          >
            {t('Contact Us')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export type QuestionSectionType = {
  questions: {
    id: number;
    question: string;
    answer: string;
  }[];
  t: TFunction<'translation', undefined>;
  active: {[x: number]: boolean};
  setActive: React.Dispatch<
    React.SetStateAction<{
      [x: number]: boolean;
    }>
  >;
  limit?: number;
};

export const QuestionSection = ({
  questions,
  t,
  active,
  setActive,
  limit = questions.length,
}: QuestionSectionType) => {
  return (
    <div className="flex flex-col items-stretch justify-start">
      {questions.map(
        (question, index) =>
          index < limit && (
            <div
              key={question.id}
              className="flex flex-col items-stretch gap-1"
            >
              <button
                className={`${index === limit - 1 ? 'border-b' : ''} flex items-center gap-3 border-t border-black justify-between py-5`}
                onClick={() => setActive({[question.id]: !active[question.id]})}
              >
                <p
                  className={`${active[question.id] ? 'text-primary-P-40' : 'text-black'} transition-colors`}
                >
                  {t(question.question)}
                </p>
                <IoIosArrowDown
                  className={`${active[question.id] ? 'rotate-180 text-primary-P-40' : 'text-black'} w-8 h-8 transition-all`}
                />
              </button>
              <AnimatePresence>
                {active[question.id] && (
                  <motion.div
                    initial={{height: 0}}
                    animate={{height: 'auto'}}
                    exit={{height: 0}}
                    className="z-10 overflow-hidden"
                  >
                    <div
                      className="mb-5"
                      dangerouslySetInnerHTML={{__html: t(question.answer)}}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ),
      )}
    </div>
  );
};

export default FAQs;
