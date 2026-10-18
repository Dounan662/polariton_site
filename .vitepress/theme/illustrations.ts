// Presentation-only drawings. The build selects these by the exact source hash;
// changed or new Mermaid diagrams fall back to Mermaid instead of a stale drawing.
const esc = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
function text(x: number, y: number, lines: string[], cls = 'figure-body', anchor = 'middle') {
  return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${lines.map((s,i) => `<tspan x="${x}" dy="${i ? 19 : 0}">${esc(s)}</tspan>`).join('')}</text>`
}
function rect(x:number,y:number,w:number,h:number,cls='figure-box') {
  return `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>`
}
function box(x:number,y:number,w:number,h:number,title:string[],body:string[]=[],cls='figure-box') {
  const total = title.length + body.length
  const top = y + (h - (total - 1)*19)/2 + 5
  return rect(x,y,w,h,cls) + text(x+w/2,top,title,'figure-label') + (body.length ? text(x+w/2,top+title.length*19,body) : '')
}
function edge(d:string,id:string,arrow=true,dashed=false) {
  return `<path class="figure-edge" d="${d}" ${arrow ? `marker-end="url(#${id})"` : ''} ${dashed ? 'stroke-dasharray="5 4"' : ''}/>`
}
const note = (x:number,y:number,lines:string[]) => text(x,y,lines,'figure-note')
export function illustration(kind:string,id:string): string {
 let content='', height=400, title=''
 if(kind==='project') {
  title='Project · investigate qubit readout';height=550
  content = rect(8,12,744,526,'figure-boundary') + text(32,45,[title],'figure-title','start')
    + rect(40,100,280,220) + text(56,128,['NODE: Baseline measurement'],'figure-label','start') + text(56,151,['Own workspace and workers'],'figure-muted','start')
    + box(56,174,248,56,['Worker A'],['Analyze readout data'],'figure-worker')
    + box(56,246,248,56,['Worker B'],['Review the analysis'],'figure-worker')
    + rect(440,100,280,220) + text(456,128,['NODE: Alternative readout setting'],'figure-label','start') + text(456,151,['Own workspace and workers'],'figure-muted','start')
    + box(456,198,248,80,['Worker C'],['Analyze alternative-setting data'],'figure-worker')
    + rect(240,400,280,116) + text(256,425,['NODE: Compare results'],'figure-label','start') + text(256,446,['Own workspace and workers'],'figure-muted','start')
    + box(256,460,248,44,['Worker D'],['Compare readout results'],'figure-worker')
    + edge('M440 210 H320',id) + note(380,196,['extends'])
    + edge('M300 400 V360 H180 V320',id) + note(240,360,['compares'])
    + edge('M460 400 V360 H580 V320',id) + note(520,360,['compares'])
 } else if(kind==='provenance') {
  title='Research provenance';height=330
  content = text(380,40,[title],'figure-title')
    + edge('M380 65 V105 M130 140 V105 H630 V140 M380 105 V140',id,false)
    + box(20,140,220,164,['Research graph history'],['Project scope','Node edits · relationships ·','inheritance references'])
    + box(270,140,220,164,['Workspace history','and checkpoints'],['Node scope','Git commits · retained','file versions'])
    + box(520,140,220,164,['Worker trajectories'],['Worker and session scope','Messages · tool activity · results'])
 } else if(kind==='capabilities') {
  title='Readout research';height=410
  content = rect(40,20,680,210,'figure-boundary')
    + text(60,51,['ENVIRONMENT: Readout research'],'figure-title','start')
    + text(60,76,['Selected capability revisions and settings'],'figure-muted','start')
    + box(60,108,300,96,['CAPABILITY: Browser tools'],['Inspect documentation'])
    + box(400,108,300,96,['CAPABILITY: Qubit analysis'],['Validate data · analyze results · report'])
    + edge('M380 230 V315',id) + note(380,275,['Select before first activation'])
    + box(180,315,400,76,['Research worker'],['Own conversation and execution context'],'figure-worker')
 } else if(kind==='architecture') {
  title='Research and capability infrastructure';height=910
  content = box(50,20,240,52,['Browser UI'])
    + rect(20,140,300,410,'figure-boundary') + text(40,168,['MainDaemon'],'figure-title','start') + text(40,191,['research and coordination'],'figure-muted','start')
    + rect(450,140,290,410,'figure-boundary') + text(470,168,['EnvironmentDaemon'],'figure-title','start') + text(470,191,['capabilities and access'],'figure-muted','start')
    + box(40,215,260,58,['Authenticated application API'])
    + box(40,325,260,70,['Research Tree'],['Graph · workspaces · Git checkpoints'])
    + box(40,450,260,76,['Agent Manager'],['Worker lifecycle · permissions ·','assignments'])
    + box(470,210,250,70,['Environment service'],['Capability revisions · access grants'])
    + box(470,350,250,80,['Preparation and','runtime management'],['Packages · artifacts ·','container lifecycle'])
    + box(470,460,250,70,['Accounts'],['Tool credentials · OAuth connections'])
    + edge('M260 72 V215',id) + note(260,108,['Local HTTP / WebSocket'])
    + edge('M170 273 V325',id)
    + edge('M40 244 H30 V430 H170 V450',id)
    + edge('M300 244 H470',id) + note(385,225,['Setup and inspection'])
    + edge('M300 488 H385 V275 H470',id) + note(385,367,['Acquire /','release access'])
    + edge('M595 280 V350',id)
    + edge('M720 245 H730 V446 H595 V460',id)
    + edge('M170 526 V602 H380 V640',id) + note(275,602,['Start and control'])
    + box(195,640,370,76,['DeepSeek Harness runtime'],['Per-worker execution · separate processes'],'figure-worker')
    + edge('M280 716 V760 H170 V820',id) + note(170,790,['Model requests'])
    + edge('M480 716 V760 H590 V820',id) + note(590,790,['Direct tool calls'])
    + box(50,820,240,64,['Model providers'])
    + box(440,820,300,64,['Authorized tools and MCP servers'])
 } else if(kind==='runtimes') {
  title='Capability runtimes';height=490
  content = box(20,24,360,82,['DeepSeek Harness runtime'],['Per-worker execution · separate processes'],'figure-worker')
    + box(450,24,280,82,['EnvironmentDaemon'],['Preparation · accounts · access grants'])
    + box(20,300,220,120,['Local MCP servers'],['Session-scoped child processes'])
    + box(270,300,220,120,['Managed tool runtimes'],['Separate containers ·','Docker engine'])
    + box(520,300,220,120,['External MCP services'],['Independently operated','HTTP endpoints'])
    + edge('M110 106 V300',id) + note(110,217,['Launch and call','over stdio'])
    + edge('M210 106 V174 H380 V300',id) + note(380,231,['HTTP calls /','stdio attach'])
    + edge('M310 106 V144 H630 V300',id) + note(630,260,['HTTP calls'])
    + edge('M730 65 H752 V462 H380 V420',id,true,true) + note(580,462,['Prepare and manage lifecycle'])
 }
 if(!content) return ''
 return `<svg class="polariton-illustration illustration-${kind}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 ${height}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${esc(title)}</title><defs><marker id="${id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1 L7 4 L1 7" class="figure-arrow"/></marker></defs>${content}</svg>`
}
