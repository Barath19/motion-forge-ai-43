import { useState, useEffect, useRef } from 'react';
import { Plus, Copy, Trash2, ExternalLink } from 'lucide-react';
import Button from './Button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Scene {
  id: string;
  title: string;
  visualDirection: string;
  text: string;
  duration: number;
}

const Builder = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [productName, setProductName] = useState('');
  const [audience, setAudience] = useState('');
  const [value, setValue] = useState('');
  const [structure, setStructure] = useState('Hook·Problem·Solution·CTA');
  const [duration, setDuration] = useState(15);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('');
  const [references, setReferences] = useState('');
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: crypto.randomUUID(),
      title: 'Hook',
      visualDirection: 'Fast-paced product reveal with dynamic camera movement',
      text: 'Ready to level up?',
      duration: 3,
    },
    {
      id: crypto.randomUUID(),
      title: 'Problem',
      visualDirection: 'Frustrated user struggling with existing solution',
      text: 'Tired of clunky workflows?',
      duration: 4,
    },
  ]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.builder-form', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
      gsap.from('.builder-preview', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addScene = () => {
    setScenes([
      ...scenes,
      {
        id: crypto.randomUUID(),
        title: 'New Scene',
        visualDirection: '',
        text: '',
        duration: 3,
      },
    ]);
  };

  const duplicateScene = (id: string) => {
    const scene = scenes.find((s) => s.id === id);
    if (scene) {
      setScenes([
        ...scenes,
        { ...scene, id: crypto.randomUUID(), title: scene.title + ' (alt)' },
      ]);
    }
  };

  const removeScene = (id: string) => {
    setScenes(scenes.filter((s) => s.id !== id));
  };

  const updateScene = (id: string, field: keyof Scene, value: string | number) => {
    setScenes(scenes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const totalStoryboardDuration = scenes.reduce((acc, scene) => acc + scene.duration, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const linkifyReferences = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.match(/^https?:\/\//)) {
        return (
          <a
            key={i}
            href={line}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            {line}
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      return <span key={i}>{line}</span>;
    });
  };

  return (
    <section id="builder" ref={sectionRef} className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Build your brief</h2>
          <p className="text-xl text-muted-foreground">
            Define your product story and let AI handle the rest
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Form */}
          <div className="builder-form space-y-6">
            {/* Product Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product name</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Orbit Sneakers"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Target audience</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Gen Z sneaker enthusiasts"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Value proposition
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={3}
                    className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Sustainable tech meets streetwear..."
                  />
                </div>
              </div>
            </div>

            {/* Story Beats Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Story beats</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Narrative structure
                  </label>
                  <select
                    value={structure}
                    onChange={(e) => setStructure(e.target.value)}
                    className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Hook·Problem·Solution·CTA</option>
                    <option>Pain·Dream·Fix</option>
                    <option>Before·After·Proof·CTA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target duration (seconds)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Scene Builder */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Storyboard scenes</h3>
                <Button variant="outline" size="sm" onClick={addScene}>
                  <Plus className="w-4 h-4" />
                  Add scene
                </Button>
              </div>
              <div className="space-y-4">
                {scenes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No scenes yet. Click "Add scene" to get started.
                  </p>
                ) : (
                  scenes.map((scene) => (
                    <div key={scene.id} className="glass rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={scene.title}
                          onChange={(e) => updateScene(scene.id, 'title', e.target.value)}
                          className="font-bold bg-transparent border-none focus:outline-none focus:ring-0 px-0"
                          placeholder="Scene title"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => duplicateScene(scene.id)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeScene(scene.id)}
                            className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={scene.visualDirection}
                        onChange={(e) =>
                          updateScene(scene.id, 'visualDirection', e.target.value)
                        }
                        rows={2}
                        className="w-full bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
                        placeholder="Visual direction..."
                      />
                      <textarea
                        value={scene.text}
                        onChange={(e) => updateScene(scene.id, 'text', e.target.value)}
                        rows={2}
                        className="w-full bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
                        placeholder="Voiceover / on-screen text..."
                      />
                      <input
                        type="number"
                        value={scene.duration}
                        onChange={(e) =>
                          updateScene(scene.id, 'duration', Number(e.target.value))
                        }
                        className="w-24 glass rounded-lg px-3 py-2 text-sm"
                        placeholder="Duration"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Prompt Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Prompt</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your creative vision..."
              />
            </div>

            {/* Mood Card */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Mood & references</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tone</label>
                  <input
                    type="text"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Energetic, minimalist, cinematic..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    References (one per line)
                  </label>
                  <textarea
                    value={references}
                    onChange={(e) => setReferences(e.target.value)}
                    rows={4}
                    className="w-full glass rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/inspiration..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Upload moodboard
                  </label>
                  <div className="glass rounded-lg border-2 border-dashed border-white/20 p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit}>
              Generate video brief
            </Button>
          </div>

          {/* Right - Preview */}
          <div ref={previewRef} className="builder-preview lg:sticky lg:top-24 h-fit">
            <div className="glass-strong rounded-2xl p-8 shadow-glow">
              <h3 className="text-xl font-bold mb-6">Live Brief Preview</h3>
              <div className="space-y-6 text-sm">
                {productName && (
                  <div>
                    <h4 className="font-bold text-accent mb-1">Product</h4>
                    <p>{productName}</p>
                  </div>
                )}
                {audience && (
                  <div>
                    <h4 className="font-bold text-accent mb-1">Audience</h4>
                    <p>{audience}</p>
                  </div>
                )}
                {value && (
                  <div>
                    <h4 className="font-bold text-accent mb-1">Value</h4>
                    <p>{value}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-accent mb-1">Narrative Structure</h4>
                  <p>{structure}</p>
                </div>
                <div>
                  <h4 className="font-bold text-accent mb-1">Duration</h4>
                  <p>
                    Target: {duration}s | Storyboard: {totalStoryboardDuration}s
                  </p>
                </div>
                {prompt && (
                  <div>
                    <h4 className="font-bold text-accent mb-1">Creative Direction</h4>
                    <p className="whitespace-pre-wrap">{prompt}</p>
                  </div>
                )}
                {tone && (
                  <div>
                    <h4 className="font-bold text-accent mb-1">Tone</h4>
                    <p>{tone}</p>
                  </div>
                )}
                {references && (
                  <div>
                    <h4 className="font-bold text-accent mb-1">References</h4>
                    <div className="space-y-1">{linkifyReferences(references)}</div>
                  </div>
                )}
                {scenes.length > 0 && (
                  <div>
                    <h4 className="font-bold text-accent mb-3">Storyboard</h4>
                    <div className="space-y-3">
                      {scenes.map((scene, i) => (
                        <div key={scene.id} className="glass rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold">
                              {i + 1}. {scene.title}
                            </span>
                            <span className="text-xs glass px-2 py-1 rounded">
                              {scene.duration}s
                            </span>
                          </div>
                          {scene.visualDirection && (
                            <p className="text-xs text-muted-foreground mb-1">
                              {scene.visualDirection}
                            </p>
                          )}
                          {scene.text && (
                            <p className="text-xs italic">&ldquo;{scene.text}&rdquo;</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Builder;
