export interface Prompt {
  id: string
  emoji: string
  title: string
  fullText: string
}

export const SOCIAL_PROMPTS: Prompt[] = [
  {
    id: 'biggest-insight',
    emoji: '💡',
    title: 'Insight',
    fullText: 'Biggest insight about today:',
  },
  {
    id: 'most-challenging',
    emoji: '💪',
    title: 'Challenge',
    fullText: 'Most challenging moment today:',
  },
  {
    id: 'progress-made',
    emoji: '🎯',
    title: 'Progress',
    fullText: 'Progress I made on my goal:',
  },
  {
    id: 'grateful-for',
    emoji: '🙏',
    title: 'Gratitude',
    fullText: 'Something I\'m grateful for:',
  },
  {
    id: 'learned-today',
    emoji: '📚',
    title: 'Learning',
    fullText: 'Something new I learned:',
  },
  {
    id: 'win-today',
    emoji: '🏆',
    title: 'Win',
    fullText: 'My win today (big or small):',
  },
]

export const FREE_FORM_PROMPT: Prompt = {
  id: 'free-form',
  emoji: '✍️',
  title: 'Write freely',
  fullText: 'Share what\'s on your mind...',
}