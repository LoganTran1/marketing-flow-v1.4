import React, { useCallback, useState, useRef, useEffect, useMemo, TouchEvent } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  NodeProps,
  Handle,
  Position,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Import images with correct casing
import thankYouPage from '../assets/Thank-you-page.png';
import thankYouButton from '../assets/Thank-you-page-button.png';
import contentPage from '../assets/Content-page-Nation.png';
import contentPage2 from '../assets/Content-page-Nation2.png';
import serpPage from '../assets/SERP-NATION.png';
import serpPageArrow from '../assets/SERP-NATION-Arrow.png';
import keywordBlockImage from '../assets/Key-terms-keyword-block.png';
import clickArrowImage from '../assets/Key-terms-click-with-arrow.png';

interface KeyTerm {
  id: string;
  term: string;
  description: string;
  category: string;
  subTerms?: KeyTerm[];
}

interface ApiTerm {
  id: string;
  term: string;
  description: string;
  type: 'load' | 'event';
}

interface Metric {
  id: string;
  term: string;
  description: string;
  formula: string;
}

interface NodeData {
  label: string;
  screenshot: string;
  type: string;
  description: string;
  keyTerms?: KeyTerm[];
  apiTerms?: ApiTerm[];
  metrics?: Metric[];
  link?: string;
}

// Define API terms for content page
const contentApiTerms: ApiTerm[] = [
  {
    id: 'api1',
    term: 'WIDGET_LOADS',
    description: 'Number of times the keyword block (widget) was loaded on the page',
    type: 'load'
  },
  {
    id: 'api2',
    term: 'WIDGET_SEARCHES',
    description: 'Triggered when a user clicks a keyword in the widget',
    type: 'event'
  }
];

// Define API terms for SERP page
const serpApiTerms: ApiTerm[] = [
  {
    id: 'api3',
    term: 'SELLSIDE_CLICKS',
    description: 'Triggered when a user clicks the blue "Visit Website" button',
    type: 'event'
  }
];

// Define key terms for each node
const leadGenTerms: KeyTerm[] = [
  {
    id: 'lg1',
    term: 'Thank You Page',
    description: 'The page users see after completing a form or action, containing relevant offers and next steps.',
    category: 'page'
  }
];

const contentTerms: KeyTerm[] = [
  {
    id: 'ct1',
    term: 'Keyword Block (Widget)',
    description: 'An iframe containg search terms (ForceKeys). Clicks on one of these terms goes to the SERP. These are the related searches on content, aka RSOC.',
    category: 'content'
  },
  {
    id: 'ct3',
    term: 'ForceKeys',
    description: 'Optimized search terms / keywords. These are passed in the URL and are requested to be shown by Google.',
    category: 'content'
  },
  {
    id: 'ct4',
    term: 'Content',
    description: 'Any vertical can be ran with content made by System1*.',
    category: 'content',
    subTerms: [
      {
        id: 'ct2',
        term: 'Headline',
        description: 'Maximum length of 55 characters (2 lines). Uses restricted language that must be approved by account manager. Must maintain keyword block position.',
        category: 'content'
      },
      {
        id: 'ct5',
        term: 'First Paragraph',
        description: 'Around 55 words with restricted language.',
        category: 'content'
      }
    ]
  }
];

const serpTerms: KeyTerm[] = [
  {
    id: 'sp1',
    term: 'Click',
    description: 'A user clicks on the "Visit Website" button. This is the monetization event. User is taken to advertiser page',
    category: 'revenue'
  },
  {
    id: 'sp3',
    term: 'Ad on the SERP',
    description: 'At least 1 advertiser will show here. End advertisers bid on search terms to get shown on this page.',
    category: 'advertising'
  }
];

// Define metrics for Content page
const contentMetrics: Metric[] = [
  {
    id: 'metric2',
    term: 'CTR1',
    description: 'Click Through Rate 1: The rate at which users click keywords in the widget after it loads',
    formula: 'CTR1 = widget_searches / widget_loads'
  }
];

// Define metrics for SERP page
const serpMetrics: Metric[] = [
  {
    id: 'metric1',
    term: 'RPC',
    description: 'Revenue Per Click on Visit Website button',
    formula: 'RPC = Revenue / Clicks on "Visit Website" button'
  },
  {
    id: 'metric3',
    term: 'CTR2',
    description: 'Click Through Rate 2: The rate at which users click "Visit Website" after searching with a keyword',
    formula: 'CTR2 = sellside_clicks / widget_searches'
  },
  {
    id: 'metric4',
    term: 'Full Funnel CTR',
    description: 'Complete conversion rate from initial widget load to final "Visit Website" click',
    formula: 'Full Funnel CTR = sellside_clicks / widget_loads'
  }
];

const SPACING = 700;
const START_X = 100;
const Y_POSITION = 40;  // Consistent Y position for all nodes

const initialNodes: Node<NodeData>[] = [
  {
    id: '1',
    type: 'screenshot',
    position: { x: START_X, y: Y_POSITION },
    data: {
      label: "Partner's Ad",
      description: 'User completes form and lands on thank you page',
      screenshot: thankYouPage,
      link: '#',
      keyTerms: leadGenTerms,
      apiTerms: [],
      metrics: []
    }
  },
  {
    id: '2',
    type: 'screenshot',
    position: { x: START_X + SPACING, y: Y_POSITION },
    data: {
      label: 'Content Page with Keyword Block',
      description: 'User lands on content page and clicks keyword block with search terms',
      screenshot: contentPage,
      link: 'https://www.nation.com/what-to-expect-at-your-first-invisalign-consultation-appointment/?var=6028076256382092669&imp=rjs&segment=google_2619374225&utm_source=google_search_networks&s1cid=22286900553&s1agid=adgroupid&placement=&s1aid=2619374225&is_pub_ref=true&utm_campaign=nation-US-en-Invisalign_Aligners-Dental_Care-9d6b7282-1893-4a00-bc52-ad6aa57f4a3e&adgroup=What_Happens_at_Your_First_Invisalign_Consultation-Invisalign_Aligners&headline=clear%20aligners%20for%20kids&optkey=clear%20aligners%20for%20kids&forcekeyA=clear%20aligners%20for%20kids&forcekeyB=invisalign%20teeth%20treatment&forcekeyC=get%20your%20first%20invisalign%20consultation%20near%20me&forcekeyD=invisalign%20aligners%20treatment&forcekeyE=invisalign%20first%20comprehensive&s1luid=2d0ce4d7-5559-4ee7-8bfc-5a55a80d65b7&s1kid=kwd-10216756&gad_source=5&gad_campaignid=22286900553&gclid=EAIaIQobChMIptC8rdavjQMV3TcIBR3WHiXJEAAYASAAEgIkpPD_BwE',
      keyTerms: contentTerms,
      apiTerms: contentApiTerms,
      metrics: contentMetrics
    }
  },
  {
    id: '3',
    type: 'screenshot',
    position: { x: START_X + (SPACING * 2), y: Y_POSITION },
    data: {
      label: 'SERP (Search Engine Results Page)',
      description: 'Search results page shows sponsored ads. When user clicks "Visit Website", this becomes the monetization event.',
      screenshot: serpPage,
      link: 'https://search.nation.com/serp?sc=2Y1eS1iaQMGh00&qc=web&is_rsoc_url=True&b=google_rsonc&q=Invisalign+Aligners+Treatment&rsToken=ChMI9JiJ6ZCwjQMVFDg0CB0ZYiFjEnMBlLqpj1SIGlaWldwEzHTcZcQViFUP1VHwSwtmzeE_mlSNCYUCMH-wFZhzIHRSVsAKZ3fotwlefxHId-pnvQkVdh9sjlMJ826trTQX3a1kK4airvynOdj2F1acUKP9VymzN0P5YFbL5ioaH4FZ031bFv4dIAM&pcsa=true&nb=0&rurl=https%3A%2F%2Fapp.snowflake.com%2F&nm=26&nx=259&ny=44&is=605x294&clkt=70',
      keyTerms: serpTerms,
      apiTerms: serpApiTerms,
      metrics: serpMetrics
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'default',
    animated: true,
    style: { stroke: '#059669', strokeWidth: 3 },
    sourceHandle: 'right',
    targetHandle: 'left',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#059669',
      width: 15,
      height: 15
    }
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'default',
    animated: true,
    style: { stroke: '#059669', strokeWidth: 3 },
    sourceHandle: 'right',
    targetHandle: 'left',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#059669',
      width: 15,
      height: 15
    }
  }
];

const ScreenshotNode = ({ data }: NodeProps<NodeData>) => {
  const [isAlternateImage, setIsAlternateImage] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<KeyTerm | null>(null);
  const [selectedParentTerm, setSelectedParentTerm] = useState<KeyTerm | null>(null);
  const [selectedApiTerm, setSelectedApiTerm] = useState<ApiTerm | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const keyTermsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyTermsRef.current && !keyTermsRef.current.contains(event.target as Element)) {
        setSelectedTerm(null);
        setSelectedParentTerm(null);
        setSelectedApiTerm(null);
        setSelectedMetric(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderKeyTerms = (terms: KeyTerm[]) => {
    const mainTerms = terms.map((term) => (
      <div key={term.id}>
        <button
          onClick={() => {
            if (term.subTerms) {
              setSelectedParentTerm(selectedParentTerm?.id === term.id ? null : term);
              setSelectedTerm(null);
            } else {
              setSelectedTerm(selectedTerm?.id === term.id ? null : term);
            }
            setSelectedApiTerm(null);
            setSelectedMetric(null);
          }}
          className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-colors w-fit whitespace-nowrap text-center
            ${(selectedParentTerm?.id === term.id || selectedTerm?.id === term.id)
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm'}`}
        >
          {term.term}
        </button>
      </div>
    ));

    const selectedTermWithSubs = terms.find(term => term.id === selectedParentTerm?.id && term.subTerms);
    
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row flex-wrap gap-2 sm:gap-4">
          {mainTerms}
        </div>
        {selectedTermWithSubs && (
          <div className="flex flex-row flex-wrap gap-2 sm:gap-4 pl-4 border-l-2 border-blue-200">
            {selectedTermWithSubs.subTerms?.map((subTerm) => (
              <button
                key={subTerm.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTerm(selectedTerm?.id === subTerm.id ? null : subTerm);
                  setSelectedApiTerm(null);
                  setSelectedMetric(null);
                }}
                className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition-colors w-fit whitespace-nowrap text-center
                  ${selectedTerm?.id === subTerm.id 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm'}`}
              >
                {subTerm.term}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Add click handler for image toggle
  const handleImageClick = (e: React.MouseEvent) => {
    if ((data.type === 'content' && data.screenshot !== thankYouPage) || data.type === 'serp') {
      e.stopPropagation();
      setIsAlternateImage(prev => !prev);
    }
  };

  // Get the correct image source based on node type and toggle state
  const getImageSource = () => {
    if (data.type === 'content' && isAlternateImage && data.screenshot !== thankYouPage) {
      return contentPage2;
    } else if (data.type === 'serp' && isAlternateImage) {
      return serpPageArrow;
    }
    return data.screenshot;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-2 min-h-[62px]">
        <h2 className="text-xl font-semibold text-gray-800 min-h-[2rem] mb-1">{data.label}</h2>
        <div className="h-[20px] flex flex-col items-center justify-center -mb-1">
          {data.id === '1' ? (
            <span className="text-sm text-gray-800 font-semibold italic">(Thank You Page)</span>
          ) : data.link !== '#' && (
            <a
              href={data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Live Link</span>
            </a>
          )}
        </div>
      </div>
      <div className="relative transform scale-[0.75] sm:scale-100">
        <Handle 
          type="target" 
          position={Position.Left} 
          style={{ left: '-20px', top: '50%', opacity: 0 }}
        />
        <div className="bg-gray-800 rounded-[40px] p-3 shadow-xl">
          <div className="relative bg-black rounded-[35px] border-[6px] border-black w-[280px] sm:w-[380px]">
            <div 
              className="relative overflow-hidden rounded-[28px] bg-white cursor-pointer touch-manipulation"
              onClick={handleImageClick}
            >
              <img 
                src={getImageSource()} 
                alt={data.label}
                className="w-full"
              />
              {data.screenshot === thankYouPage && (
                <div className="absolute top-[42%] left-0 right-0 flex justify-center">
                  <img 
                    src={thankYouButton} 
                    alt="Thank you button"
                    className="w-[60%]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <Handle 
          type="source" 
          position={Position.Right} 
          style={{ right: '-20px', top: '50%', opacity: 0 }}
        />
      </div>
      {data.keyTerms && (
        <div 
          ref={keyTermsRef} 
          className="mt-4 bg-gray-50 rounded-lg p-3 sm:p-6 w-[85vw] sm:w-[560px] min-h-[200px] overflow-y-auto"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Key Terms</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {renderKeyTerms(data.keyTerms)}
          </div>
          
          {(selectedTerm || selectedParentTerm) && (
            <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-medium text-gray-800">
                    {selectedTerm?.term || selectedParentTerm?.term}
                  </h4>
                  <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded-full">
                    #{selectedTerm?.category || selectedParentTerm?.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedTerm?.description || selectedParentTerm?.description}
                </p>
                {(selectedTerm?.term === 'Keyword Block (Widget)' || selectedParentTerm?.term === 'Keyword Block (Widget)') && (
                  <div className="mt-2">
                    <img 
                      src={keywordBlockImage} 
                      alt="Keyword Block Example"
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                )}
                {(selectedTerm?.term === 'Click' || selectedParentTerm?.term === 'Click') && (
                  <div className="mt-2">
                    <img 
                      src={clickArrowImage} 
                      alt="Click Arrow Example"
                      className="w-full rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Terms Section */}
          {data.id !== '1' && data.apiTerms && data.apiTerms.length > 0 && (
            <>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-gray-700 mb-2">API Terms</h3>
                <div className="flex flex-wrap gap-2">
                  {data.apiTerms.map((term) => (
                    <button
                      key={term.id}
                      onClick={() => {
                        setSelectedApiTerm(selectedApiTerm?.id === term.id ? null : term);
                        setSelectedTerm(null);
                        setSelectedMetric(null);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                        ${selectedApiTerm?.id === term.id 
                          ? 'bg-purple-500 text-white shadow-sm' 
                          : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'}`}
                    >
                      {term.term}
                    </button>
                  ))}
                </div>
              </div>

              {selectedApiTerm && (
                <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-base font-medium text-gray-800">
                        {selectedApiTerm?.term}
                      </h4>
                      <span className="text-xs font-medium text-purple-600 px-2 py-1 bg-purple-50 rounded-full">
                        {selectedApiTerm?.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedApiTerm?.description}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Metrics Section */}
          {data.id !== '1' && data.metrics && data.metrics.length > 0 && (
            <>
              <div className="mt-4">
                <h3 className="text-base font-semibold text-gray-700 mb-2">Metrics</h3>
                <div className="flex flex-wrap gap-2">
                  {data.metrics.map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => {
                        setSelectedMetric(selectedMetric?.id === metric.id ? null : metric);
                        setSelectedTerm(null);
                        setSelectedApiTerm(null);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                        ${selectedMetric?.id === metric.id 
                          ? 'bg-amber-500 text-white shadow-md' 
                          : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-sm'}`}
                    >
                      {metric.term}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMetric && (
                <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-base font-medium text-gray-800">
                      {selectedMetric?.term}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedMetric?.description}
                    </p>
                    <div className="mt-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                      Formula: {selectedMetric?.formula}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  screenshot: ScreenshotNode,
};

export function MarketingFlow() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  const [currentNode, setCurrentNode] = useState(0);
  const [selectedTerms, setSelectedTerms] = useState<{ [nodeId: string]: KeyTerm | null }>({});
  const [selectedApiTerms, setSelectedApiTerms] = useState<{ [nodeId: string]: ApiTerm | null }>({});
  const [selectedMetrics, setSelectedMetrics] = useState<{ [nodeId: string]: Metric | null }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderMobileNode = (node: Node<NodeData>) => (
    <div key={node.id} className="min-w-full px-4">
      <div className="text-center mb-1 min-h-[62px]">
        <h2 className="text-xl font-semibold text-gray-800 min-h-[2rem] mb-1">
          {node.data.label}
        </h2>
        <div className="h-[20px] flex flex-col items-center justify-center -mb-1">
          {node.id === '1' ? (
            <span className="text-sm text-gray-800 font-semibold italic">(Thank You Page)</span>
          ) : node.data.link !== '#' && (
            <a
              href={node.data.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Live Link</span>
            </a>
          )}
        </div>
      </div>
      
      {/* Phone Frame */}
      <div className="transform scale-90 origin-top mx-auto">
        <div className="bg-gray-800 rounded-[40px] p-3 shadow-xl">
          <div className="relative bg-black rounded-[35px] border-[6px] border-black overflow-hidden">
            <img 
              src={node.data.screenshot} 
              alt={node.data.label}
              className="w-full rounded-[28px]"
            />
            {node.data.screenshot === thankYouPage && (
              <div className="absolute top-[42%] left-0 right-0 flex justify-center">
                <img 
                  src={thankYouButton} 
                  alt="Thank you button"
                  className="w-[60%]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Terms Section */}
      <div className="-mt-12 bg-gray-50 rounded-lg p-4 mb-8 min-h-[200px]">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Key Terms</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {node.data.keyTerms?.map((term) => (
            <button
              key={term.id}
              onClick={() => {
                setSelectedTerms(prev => ({
                  ...prev,
                  [node.id]: prev[node.id]?.id === term.id ? null : term
                }));
                setSelectedApiTerms(prev => ({ ...prev, [node.id]: null }));
                setSelectedMetrics(prev => ({ ...prev, [node.id]: null }));
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedTerms[node.id]?.id === term.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm'}`}
            >
              {term.term}
            </button>
          ))}
        </div>

        {selectedTerms[node.id] && (
          <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h4 className="text-base font-medium text-gray-800">
                  {selectedTerms[node.id]?.term}
                </h4>
                <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded-full">
                  #{selectedTerms[node.id]?.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {selectedTerms[node.id]?.description}
              </p>
              {selectedTerms[node.id]?.term === 'Keyword Block (Widget)' && (
                <div className="mt-2">
                  <img 
                    src={keywordBlockImage} 
                    alt="Keyword Block Example"
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              )}
              {selectedTerms[node.id]?.term === 'Click' && (
                <div className="mt-2">
                  <img 
                    src={clickArrowImage} 
                    alt="Click Arrow Example"
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* API Terms Section */}
        {node.id !== '1' && node.data.apiTerms && node.data.apiTerms.length > 0 && (
          <>
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-700 mb-2">API Terms</h3>
              <div className="flex flex-wrap gap-2">
                {node.data.apiTerms.map((term) => (
                  <button
                    key={term.id}
                    onClick={() => {
                      setSelectedApiTerms(prev => ({
                        ...prev,
                        [node.id]: prev[node.id]?.id === term.id ? null : term
                      }));
                      setSelectedTerms(prev => ({ ...prev, [node.id]: null }));
                      setSelectedMetrics(prev => ({ ...prev, [node.id]: null }));
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${selectedApiTerms[node.id]?.id === term.id 
                        ? 'bg-purple-500 text-white shadow-md' 
                        : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200 shadow-sm'}`}
                  >
                    {term.term}
                  </button>
                ))}
              </div>
            </div>

            {selectedApiTerms[node.id] && (
              <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-base font-medium text-gray-800">
                      {selectedApiTerms[node.id]?.term}
                    </h4>
                    <span className="text-xs font-medium text-purple-600 px-2 py-1 bg-purple-50 rounded-full">
                      {selectedApiTerms[node.id]?.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedApiTerms[node.id]?.description}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Metrics Section */}
        {node.id !== '1' && node.data.metrics && node.data.metrics.length > 0 && (
          <>
            <div className="mt-4">
              <h3 className="text-base font-semibold text-gray-700 mb-2">Metrics</h3>
              <div className="flex flex-wrap gap-2">
                {node.data.metrics.map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => {
                      setSelectedMetrics(prev => ({
                        ...prev,
                        [node.id]: prev[node.id]?.id === metric.id ? null : metric
                      }));
                      setSelectedTerms(prev => ({ ...prev, [node.id]: null }));
                      setSelectedApiTerms(prev => ({ ...prev, [node.id]: null }));
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${selectedMetrics[node.id]?.id === metric.id 
                        ? 'bg-amber-500 text-white shadow-md' 
                        : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-sm'}`}
                  >
                    {metric.term}
                  </button>
                ))}
              </div>
            </div>

            {selectedMetrics[node.id] && (
              <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-medium text-gray-800">
                    {selectedMetrics[node.id]?.term}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedMetrics[node.id]?.description}
                  </p>
                  <div className="mt-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                    Formula: {selectedMetrics[node.id]?.formula}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full min-h-screen">
        {/* Mobile Panels */}
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentNode * 100}vw)` }}
        >
          {initialNodes.map((node) => (
            <div key={node.id} className="min-w-full px-4">
              <div className="text-center mb-1 min-h-[62px]">
                <h2 className="text-xl font-semibold text-gray-800 min-h-[2rem] mb-1">
                  {node.data.label}
                </h2>
                <div className="h-[20px] flex flex-col items-center justify-center -mb-1">
                  {node.id === '1' ? (
                    <span className="text-sm text-gray-800 font-semibold italic">(Thank You Page)</span>
                  ) : node.data.link !== '#' && (
                    <a
                      href={node.data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Live Link</span>
                    </a>
                  )}
                </div>
              </div>
              
              {/* Phone Frame */}
              <div className="transform scale-90 origin-top mx-auto">
                <div className="bg-gray-800 rounded-[40px] p-3 shadow-xl">
                  <div className="relative bg-black rounded-[35px] border-[6px] border-black overflow-hidden">
                    <img 
                      src={node.data.screenshot} 
                      alt={node.data.label}
                      className="w-full rounded-[28px]"
                    />
                    {node.data.screenshot === thankYouPage && (
                      <div className="absolute top-[42%] left-0 right-0 flex justify-center">
                        <img 
                          src={thankYouButton} 
                          alt="Thank you button"
                          className="w-[60%]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Terms Section */}
              <div className="-mt-12 bg-gray-50 rounded-lg p-4 mb-8 min-h-[200px]">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Key Terms</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {node.data.keyTerms?.map((term) => (
                    <button
                      key={term.id}
                      onClick={() => {
                        setSelectedTerms(prev => ({
                          ...prev,
                          [node.id]: prev[node.id]?.id === term.id ? null : term
                        }));
                        setSelectedApiTerms(prev => ({ ...prev, [node.id]: null }));
                        setSelectedMetrics(prev => ({ ...prev, [node.id]: null }));
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                        ${selectedTerms[node.id]?.id === term.id 
                          ? 'bg-blue-500 text-white shadow-md' 
                          : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200 shadow-sm'}`}
                    >
                      {term.term}
                    </button>
                  ))}
                </div>

                {selectedTerms[node.id] && (
                  <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-base font-medium text-gray-800">
                          {selectedTerms[node.id]?.term}
                        </h4>
                        <span className="text-xs font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded-full">
                          #{selectedTerms[node.id]?.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedTerms[node.id]?.description}
                      </p>
                      {selectedTerms[node.id]?.term === 'Keyword Block (Widget)' && (
                        <div className="mt-2">
                          <img 
                            src={keywordBlockImage} 
                            alt="Keyword Block Example"
                            className="w-full rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                      {selectedTerms[node.id]?.term === 'Click' && (
                        <div className="mt-2">
                          <img 
                            src={clickArrowImage} 
                            alt="Click Arrow Example"
                            className="w-full rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* API Terms Section */}
                {node.id !== '1' && node.data.apiTerms && node.data.apiTerms.length > 0 && (
                  <>
                    <div className="mt-4">
                      <h3 className="text-base font-semibold text-gray-700 mb-2">API Terms</h3>
                      <div className="flex flex-wrap gap-2">
                        {node.data.apiTerms.map((term) => (
                          <button
                            key={term.id}
                            onClick={() => {
                              setSelectedApiTerms(prev => ({
                                ...prev,
                                [node.id]: prev[node.id]?.id === term.id ? null : term
                              }));
                              setSelectedTerms(prev => ({ ...prev, [node.id]: null }));
                              setSelectedMetrics(prev => ({ ...prev, [node.id]: null }));
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                              ${selectedApiTerms[node.id]?.id === term.id 
                                ? 'bg-purple-500 text-white shadow-md' 
                                : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200 shadow-sm'}`}
                          >
                            {term.term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedApiTerms[node.id] && (
                      <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <h4 className="text-base font-medium text-gray-800">
                              {selectedApiTerms[node.id]?.term}
                            </h4>
                            <span className="text-xs font-medium text-purple-600 px-2 py-1 bg-purple-50 rounded-full">
                              {selectedApiTerms[node.id]?.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedApiTerms[node.id]?.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Metrics Section */}
                {node.id !== '1' && node.data.metrics && node.data.metrics.length > 0 && (
                  <>
                    <div className="mt-4">
                      <h3 className="text-base font-semibold text-gray-700 mb-2">Metrics</h3>
                      <div className="flex flex-wrap gap-2">
                        {node.data.metrics.map((metric) => (
                          <button
                            key={metric.id}
                            onClick={() => {
                              setSelectedMetrics(prev => ({
                                ...prev,
                                [node.id]: prev[node.id]?.id === metric.id ? null : metric
                              }));
                              setSelectedTerms(prev => ({ ...prev, [node.id]: null }));
                              setSelectedApiTerms(prev => ({ ...prev, [node.id]: null }));
                            }}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                              ${selectedMetrics[node.id]?.id === metric.id 
                                ? 'bg-amber-500 text-white shadow-md' 
                                : 'bg-white text-amber-700 hover:bg-amber-50 border border-amber-200 shadow-sm'}`}
                          >
                            {metric.term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedMetrics[node.id] && (
                      <div className="mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-base font-medium text-gray-800">
                            {selectedMetrics[node.id]?.term}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {selectedMetrics[node.id]?.description}
                          </p>
                          <div className="mt-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                            Formula: {selectedMetrics[node.id]?.formula}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={2.0}
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: true,
          minZoom: 0.2,
          maxZoom: 2.0
        }}
      >
        <Background color="#aaa" gap={16} />
        <Controls 
          showZoom={true}
          className="!bottom-4 !right-4 !top-auto"
        />
        <MiniMap style={{ background: '#f8f8f8' }} />
      </ReactFlow>
    </div>
  );
} 