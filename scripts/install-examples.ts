// Installed-source examples and visual requirements, independent of registry declarations.
// New items need usable props and required keyframes; compilation alone cannot detect missing CSS.
export const installExamples: Record<
  string,
  { render: string; animations: string[] }
> = {
  "theme-toggle": {
    render:
      '<ThemeToggle defaultTheme="light" pageTransition="circular" onThemeChange={(mode) => { document.documentElement.dataset.theme = mode; }} />',
    animations: [],
  },
  select: {
    render:
      '<Select label="Plan" options={[{value:"personal",label:"Personal"},{value:"team",label:"Team"}]} defaultValue="personal" />',
    animations: [],
  },
  "text-morph": {
    render: "<TextMorph>Save changes</TextMorph>",
    animations: [],
  },
  "number-roll": {
    render: '<NumberRoll value={1248} from={0} locales="en-US" />',
    animations: ["ui-col-in", "ui-col-out"],
  },
  kbd: {
    render:
      '<><Kbd label="Open commands" hotkey="k" onTrigger={() => {}} stopPropagation aria-label="Open commands" /><Kbd keys="mod+shift+p" live /><Kbd keys={["up", "down", "enter"]} size="sm" live /></>',
    animations: [],
  },
  "command-palette": {
    render:
      '<CommandPalette items={[{id:"home",label:"Home",icon:<span>H</span>,onSelect:()=>{}}]} triggerIcon={<span>C</span>} filters={[{id:"pages",label:"Pages"}]} onFilterRemove={()=>{}} footer={<p>Not what you’re looking for? Try the <a href="/help">Help Center</a></p>} />',
    animations: [],
  },
  "answer-paper": {
    render:
      '<CavemioAnswerPaper levels={[{id:"short",label:"Brief",readTime:1,content:<p>Short answer.</p>},{id:"long",label:"Full",readTime:10,content:<p>A longer answer with supporting details.</p>}]} />',
    animations: [],
  },
  "inline-rewrite": {
    render:
      '<InlineRewrite versions={[{label:"Short",text:"A short answer."},{label:"Long",text:"A longer answer with details."}]} />',
    animations: ["ui-sheen", "ui-col-in", "ui-col-out"],
  },
  "message-edit": {
    render: '<MessageEdit text="Edit this message" onSubmit={() => {}} />',
    animations: ["ui-fade-in", "ui-col-in", "ui-col-out"],
  },
  "response-versions": {
    render:
      "<ResponseVersions count={1} index={0} onIndexChange={() => {}} onRegenerate={() => {}}><p>Assistant answer.</p></ResponseVersions>",
    animations: ["ui-col-in", "ui-col-out"],
  },
  "drop-zone-membrane": {
    render: "<DropZoneMembrane />",
    animations: ["attachment-shimmer", "ui-col-in", "ui-col-out"],
  },
  "step-timeline": {
    render:
      '<StepTimeline steps={[{id:"one",title:"One",description:"First step"}]} />',
    animations: [],
  },
  "request-lifecycle-preview": {
    render:
      '<RequestLifecyclePreview stage="asked" data={{title:"A request",description:"A request to improve something",votes:2,voters:[],activity:[],roadmap:{label:"Planned",count:1,address:"example.test"},release:{badge:"New",date:"2026-10-16",title:"Released",description:"Now available"},email:{sender:"Team",initials:"T",recipient:"Reader",time:"Now",greeting:"Hello",message:"Your request is ready"}}} />',
    animations: [],
  },
  "clarifying-question": {
    render:
      '<ClarifyingQuestion question="Which shop?" options={[{id:"main",label:"Main Street"}]} onAnswer={() => {}} />',
    animations: [
      "ui-fade-in",
      "ui-ping",
      "ui-sheen",
      "ui-col-in",
      "ui-col-out",
    ],
  },
};
