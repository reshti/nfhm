import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Trash2, Sparkles, BookOpen, ShieldAlert, WifiOff } from 'lucide-react';
import { NAFHAM_CONTENT } from '../data/nafhamData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  isOfflineFallback?: boolean;
}

const SUGGESTED_QUESTIONS = [
  'ما المقصود باضطراب طيف التوحد؟',
  'هل تختلف خصائص التوحد من شخص لآخر؟',
  'لماذا قد يتأثر بعض الأشخاص بالأصوات؟',
  'كيف يمكنني التواصل بطريقة أفضل؟',
  'كيف أدعم زميلي في المدرسة؟',
  'ما المقصود بوسائل التواصل البديلة (AAC)؟',
  'ما المفاهيم الخاطئة الشائعة عن التوحد؟',
];

// Offline verified knowledge base
const OFFLINE_KNOWLEDGE: { [key: string]: { text: string; sources: string[] } } = {
  'ما المقصود باضطراب طيف التوحد؟': {
    text: 'اضطراب طيف التوحد هو اختلاف نمائي عصبي يبدأ في مراحل النمو المبكرة ويستمر مدى الحياة. يؤثر على طريقة إدراك الفرد للعالم وتواصله وتفاعله مع محيطه ومعالجة المثيرات الحسية. وتؤكد الأبحاث أنه اختلاف بيولوجي جيني وليس مرضاً معدياً أو نتيجة لأسلوب التربية.',
    sources: ['منظمة الصحة العالمية WHO', 'الدليل التشخيصي DSM-5'],
  },
  'هل تختلف خصائص التوحد من شخص لآخر؟': {
    text: 'نعم بكل تأكيد! لهذا السبب يُطلق عليه مسمى "طيف" (Spectrum). كل شخص على الطيف فريد تماماً في قدراته واحتياجاته ومواهبه ونقاط قوته. فبينما يحتاج بعضهم إلى دعم بسيط ومستقل، قد يحتاج آخرون إلى وسائل تواصل بديلة ومساندة مكثفة.',
    sources: ['مراكز السيطرة على الأمراض والوقاية منها CDC', 'جامعة الإمام عبدالرحمن بن فيصل'],
  },
  'لماذا قد يتأثر بعض الأشخاص بالأصوات؟': {
    text: 'يعود ذلك إلى ظاهرة "فرط الاستجابة الحسية" (Sensory Hyper-reactivity)، حيث يعالج الدماغ الأصوات العادية (مثل صوت مجفف اليدين، الأجراس، أو الازدحام) بحدة مفرطة قد تسبب إجهاداً عصبياً وألماً حقيقياً. تساهم أدوات مثل سماعات إلغاء الضجيج والمناطق الهادئة في توفير راحة كبيرة.',
    sources: ['المجلة الأمريكية للعلاج الوظيفي AJOT'],
  },
  'كيف يمكنني التواصل بطريقة أفضل؟': {
    text: 'استخدم لغة مباشرة وواضحة، تجنب التلميحات الغامضة والمجازات المعقدة، وامنح الشخص وقتاً كافياً (عدة ثوانٍ إضافية) لمعالجة الكلام وصياغة الرد. تذكر أيضاً أن التواصل البصري المستمر قد يكون مجهداً، وعدم تثبيت النظر لا يعني عدم الإصغاء.',
    sources: ['الجمعية الأمريكية للكلام واللغة والسمع ASHA'],
  },
  'كيف أدعم زميلي في المدرسة؟': {
    text: 'أفضل دعم هو الصداقة الصادقة: دعه يشارك في الألعاب الهادئة دون ضغط، احترم رغبته في الهدوء عند الحاجة، وكن صبوراً ومتفهماً لطرقه في التعبير. وتذكر أن رفضه للمصافحة أو التلامس الجسدي حق شخصي يرتبط بالحساسية اللمسية وليس قلة ذوق.',
    sources: ['دليل الدمج المدرسي - جامعة الإمام عبدالرحمن بن فيصل'],
  },
  'ما المقصود بوسائل التواصل البديلة (AAC)؟': {
    text: 'وسائل التواصل المعززة والبديلة (AAC) هي مجموعة من الأدوات التي تمكن الأفراد غير الناطقين أو من يجدون صعوبة في الكلام من التعبير الكامل عن مشاعرهم واحتياجاتهم، مثل بطاقات تبادل الصور (PECS) والأجهزة اللوحية المبرمجة بتطبيقات النطق الصوتي.',
    sources: ['المنظمة الدولية للتواصل المعزز والبديل ISAAC'],
  },
  'ما المفاهيم الخاطئة الشائعة عن التوحد؟': {
    text: 'من أشهر المفاهيم الخاطئة: خرافة أن اللقاحات تسبب التوحد (دحضها العلم تماماً)، وخرافة أن ذوي التوحد لا يشعرون بالعواطف (هم يشعرون بعمق وصدق كبير)، وخرافة وجود حمية أو دواء سحري يشفي التوحد (التدخلات التربوية والسلوكية هي الأساس المعتمد).',
    sources: ['إدارة الغذاء والدواء FDA', 'منظمة الصحة العالمية WHO'],
  },
};

export const AskNafhamChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'أهلاً بك في خدمة «رفيق نفهم» التوعوية برعاية جامعة الإمام عبدالرحمن بن فيصل. أنا مساعدك التثقيفي المعتمد للإجابة عن تساؤلاتك التربوية والاجتماعية حول اضطراب طيف التوحد وسبل الدعم الإيجابي والدمج المجتمعي.',
      sources: ['مبادرة نفهم للتوعية بطيف التوحد', 'جامعة الإمام عبدالرحمن بن فيصل'],
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendQuestion = async (queryText?: string) => {
    const textToSend = (queryText || inputQuestion).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    // First check local vetted Q&A
    const offlineMatch = OFFLINE_KNOWLEDGE[textToSend];

    try {
      // Attempt backend proxy route
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToSend }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          sources: data.sources || ['منظمة الصحة العالمية WHO', 'جامعة الإمام عبدالرحمن بن فيصل'],
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Network failed or offline mode
    }

    // Fallback: If offline or API unavailable, use vetted local knowledge
    setTimeout(() => {
      let fallbackText =
        'أنا رفيق نفهم التوعوي. وفقاً للمصادر العلمية المعتمدة الصادرة عن منظمة الصحة العالمية وجامعة الإمام عبدالرحمن بن فيصل، فإن اضطراب طيف التوحد هو اختلاف نمائي عصبي يتطلب الفهم والمواءمة البيئية والتقبل. أرجو ملاحظة أنني مساعد تثقيفي وتربوي ولا أقدم تشخيصات طبية شخصية، وعند الشك أو الاستشارة الطبية يُرجى مراجعة طبيب نمو أطفال متخصص أو مركز معتمد.';
      let sources = ['منظمة الصحة العالمية WHO', 'جامعة الإمام عبدالرحمن بن فيصل'];

      if (offlineMatch) {
        fallbackText = offlineMatch.text;
        sources = offlineMatch.sources;
      }

      const assistantMsg: ChatMessage = {
        id: `offline-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        sources: sources,
        isOfflineFallback: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 400);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'تم بدء محادثة جديدة. تفضل بطرح أي سؤال تثقيفي حول طيف التوحد والدمج ووسائل الدعم الإيجابي.',
        sources: ['مبادرة نفهم'],
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 text-right">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0a4d7a] to-[#2eb9df] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#0a4d7a]">رفيق نفهم الذكي</h2>
            <p className="text-xs text-slate-500">
              مساعد توعوي متخصص بإشراف جامعة الإمام عبدالرحمن بن فيصل
            </p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>مسح المحادثة</span>
        </button>
      </div>

      {/* Mandatory Safety Notice Banner */}
      <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>إشعار الضوابط الطبية والعلمية:</strong> هذا المساعد مخصص للتثقيف والتوعية التربوية
          المسندة بالبينات فقط. لا يقدم المساعد أي تشخيص طبي، ولا يصف أدوية أو بروتوكولات علاجية
          شخصية. عند الحاجة لتقييم تشخيصي رسمي يُرجى مراجعة الأطباء والمختصين المعتمدين.
        </p>
      </div>

      {/* Suggested Questions Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 block">أسئلة شائعة مقترحة:</span>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendQuestion(q)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-[#f0f7fb] text-[#0a4d7a] border border-slate-200 hover:border-[#0c6aa7] transition-all cursor-pointer shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Display */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 sm:p-8 space-y-4 min-h-[380px] max-h-[550px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#0c6aa7] text-white rounded-tr-xs'
                  : 'bg-[#f4f9fd] text-[#304254] border border-[#d2e8f6] rounded-tl-xs'
              }`}
            >
              <p className="font-normal">{msg.text}</p>

              {/* Verified Sources Badge */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-current/15 text-[11px] opacity-90 flex flex-wrap items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 inline" />
                  <span className="font-semibold">المصادر المرجعية:</span>
                  <span>{msg.sources.join(' · ')}</span>
                  {msg.isOfflineFallback && (
                    <span className="text-[10px] bg-slate-200/60 text-slate-700 px-1.5 py-0.5 rounded-md mr-1">
                      (قاعدة معرفة محلية موثوقة)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-slate-100 text-[#0a4d7a] p-3 rounded-2xl text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0c6aa7] animate-ping" />
              <span>جاري صياغة إجابة علمية موثقة...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendQuestion();
        }}
        className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm focus-within:border-[#0c6aa7]"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="اكتب سؤالك التوعوي أو التربوي هنا..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-transparent text-right focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          className="p-3 rounded-xl bg-[#0c6aa7] hover:bg-[#0a4d7a] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 transform rotate-180" />
        </button>
      </form>
    </div>
  );
};
