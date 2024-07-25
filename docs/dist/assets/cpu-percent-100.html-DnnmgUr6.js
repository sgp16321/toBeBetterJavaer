import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,o as a,e}from"./app-CiW81ZiS.js";const t={},n=e(`<h1 id="第十八节-cpu-100-排查优化实战" tabindex="-1"><a class="header-anchor" href="#第十八节-cpu-100-排查优化实战"><span>第十八节：CPU 100%排查优化实战</span></a></h1><p>前面给大家讲过一次 <a href="https://javabetter.cn/jvm/oom.html" target="_blank" rel="noopener noreferrer">OOM 的优化排查实战</a>，今天再给大家讲一个 CPU 100% 优化排查实战。</p><p>收到运维同学的报警，说某些服务器负载非常高，让我们开发定位问题。拿到问题后先去服务器上看了看，发现运行的只有我们的 Java 应用程序。于是先用 <code>ps</code> 命令拿到了应用的 <code>PID</code>。</p><blockquote><p>ps：查看进程的命令；PID：进程 ID。<code>ps -ef | grep java</code> 可以查看所有的 Java 进程。前面也曾讲过。</p></blockquote><p>接着使用 <code>top -Hp pid</code> 将这个进程的线程显示出来。输入大写 P 可以将线程按照 CPU 使用比例排序，于是得到以下结果。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-e9b35104-fce9-40ea-ae91-8bbb7fd8aa96.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>果然，某些线程的 CPU 使用率非常高，99.9% 可不是非常高嘛（😂）。</p><p>为了方便问题定位，我立马使用 <code>jstack pid &gt; pid.log</code> 将线程栈 <code>dump</code> 到日志文件中。关于 <a href="https://javabetter.cn/jvm/console-tools.html" target="_blank" rel="noopener noreferrer">jstack</a> 命令，我们前面刚刚讲过。</p><p>我在上面 99.9% 的线程中随机选了一个 <code>pid=194283</code> 的，转换为 16 进制（2f6eb）后在线程快照中查询：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-f8b051d5-f28d-481e-a0b2-e97151797e3b.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>线程快照中线程 ID 都是16进制的。</p></blockquote><p>发现这是 <code>Disruptor</code> 的一个堆栈，好家伙，这不前面刚遇到过嘛，老熟人啊， <a href="https://javabetter.cn/jvm/oom.html" target="_blank" rel="noopener noreferrer">强如 Disruptor 也发生内存溢出？</a></p><p>真没想到，再来一次！</p><p>为了更加直观的查看线程的状态，我将快照信息上传到了专门的分析平台上：<a href="http://fastthread.io/" target="_blank" rel="noopener noreferrer">http://fastthread.io/</a>，估计有球友用过。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-d6c9bc1c-9600-47f2-9ff1-d0c9bd8ef849.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>其中有一项展示了所有消耗 CPU 的线程，我仔细看了下，发现几乎都和上面的堆栈一样。</p><p>也就是说，都是 <code>Disruptor</code> 队列的堆栈，都在执行 <code>java.lang.Thread.yield</code>。</p><p>众所周知，<code>yield</code> 方法会暗示当前线程让出 <code>CPU</code> 资源，让其他线程来竞争（<a href="https://javabetter.cn/thread/wangzhe-thread.html" target="_blank" rel="noopener noreferrer">多线程</a>的时候我们讲过 yield，相信大家还有印象）。</p><p>根据刚才的线程快照发现，处于 <code>RUNNABLE</code> 状态并且都在执行 <code>yield</code> 的线程大概有 30几个。</p><p>初步判断，大量线程执行 <code>yield</code> 之后，在互相竞争导致 CPU 使用率增高，通过对堆栈的分析可以发现，确实和 <code>Disruptor</code> 有关。</p><p>好家伙，又是它。</p><p>既然如此，我们来大致看一下 <code>Disruptor</code> 的使用方式吧。看有多少球友使用过。</p><p>第一步，在 pom.xml 文件中引入 <code>Disruptor</code> 的依赖：</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;com.lmax&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;disruptor&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;3.4.2&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步，定义事件 LongEvent：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> LongEvent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> long</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">value</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> value;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B;">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> String</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> toString</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;LongEvent{value=&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> value </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;}&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第三步，定义事件工厂：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">// 定义事件工厂</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> LongEventFactory</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> EventFactory</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">LongEvent</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B;">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> LongEvent</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> newInstance</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> LongEvent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第四步，定义事件处理器：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">// 定义事件处理器</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> LongEventHandler</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> implements</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> EventHandler</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">LongEvent</span><span style="--shiki-light:#C18401;--shiki-dark:#ABB2BF;">&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B;">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> onEvent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">LongEvent</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> event</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">long</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> sequence</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">boolean</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> endOfBatch</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Event: &quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> event);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第五步，定义事件发布者：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> main</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">[] args) throws InterruptedException {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 指定 Ring Buffer 的大小</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> bufferSize </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 1024</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 构建 Disruptor</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    Disruptor</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">LongEvent</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> disruptor </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Disruptor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;&gt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> LongEventFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">            bufferSize</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">            Executors</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">defaultThreadFactory</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 连接事件处理器</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    disruptor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">handleEventsWith</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> LongEventHandler</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">());</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 启动 Disruptor</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    disruptor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">start</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 获取 Ring Buffer</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    RingBuffer</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">LongEvent</span><span style="--shiki-light:#E45649;--shiki-dark:#ABB2BF;">&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> ringBuffer </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> disruptor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getRingBuffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 生产事件</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">    ByteBuffer</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> bb </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> ByteBuffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">allocate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">8</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    for</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">long</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> l </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> l </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">&lt;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 100</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> l</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">++</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        bb</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">putLong</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, l);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        ringBuffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">publishEvent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">((event, sequence, buffer) </span><span style="--shiki-light:#C18401;--shiki-dark:#C678DD;">-&gt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> event</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">buffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getLong</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)), bb);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        Thread</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">sleep</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1000</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // 关闭 Disruptor</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">    disruptor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">shutdown</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>简单解释下：</p><ul><li>LongEvent：这是要通过 Disruptor 传递的数据或事件。</li><li>LongEventFactory：用于创建事件对象的工厂类。</li><li>LongEventHandler：事件处理器，定义了如何处理事件。</li><li>Disruptor 构建：创建了一个 Disruptor 实例，指定了事件工厂、缓冲区大小和线程工厂。</li><li>事件发布：示例中演示了如何发布事件到 Ring Buffer。</li></ul><p>大家可以运行看一下输出结果。</p><h2 id="解决问题" tabindex="-1"><a class="header-anchor" href="#解决问题"><span>解决问题</span></a></h2><p>我查了下代码，发现每一个业务场景在内部都会使用 2 个 <code>Disruptor</code> 队列来解耦。</p><p>假设现在有 7 个业务，那就等于创建了 <code>2*7=14</code> 个 <code>Disruptor</code> 队列，同时每个队列有一个消费者，也就是总共有 14 个消费者（生产环境更多）。</p><p>同时发现配置的消费等待策略为 <code>YieldingWaitStrategy</code>，这种等待策略会执行 yield 来让出 CPU。代码如下：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-49840c0d-2c10-4bcb-80c6-1df7553ddb6c.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>初步来看，和等待策略有很大的关系。</p><h3 id="本地模拟" tabindex="-1"><a class="header-anchor" href="#本地模拟"><span>本地模拟</span></a></h3><p>为了验证，我在本地创建了 15 个 <code>Disruptor</code> 队列，同时结合监控观察 CPU 的使用情况。</p><p>注意看代码 YieldingWaitStrategy：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-7f3b2fa6-6505-4b67-9f42-0170a236832b.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>以及事件处理器：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-d597089d-54e0-49ef-a0f9-41798e84de48.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>创建了 15 个 <code>Disruptor</code> 队列，同时每个队列都用线程池来往 <code>Disruptor队列</code> 里面发送 100W 条数据。消费程序仅仅只是打印一下。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-97b88b4d-2d81-47ab-9beb-830ac122c282.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>跑了一段时间，发现 CPU 使用率确实很高。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-c0ee1da2-29af-4581-b0d8-97f6250401e7.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>同时 <code>dump</code> 线程发现和生产环境中的现象也是一致的：消费线程都处于 <code>RUNNABLE</code> 状态，同时都在执行 <code>yield</code>。</p><p>通过查询 <code>Disruptor</code> 官方文档发现：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-de904a90-8b59-4333-82f5-9ec94a6525a0.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>YieldingWaitStrategy 是一种充分压榨 CPU 的策略，使用<code>自旋 + yield</code>的方式来提高性能。当消费线程（Event Handler threads）的数量小于 CPU 核心数时推荐使用该策略。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-3faf6f7e-0d2c-4cfe-8e3a-07e15601485d.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>同时查到其他的等待策略，比如说 <code>BlockingWaitStrategy</code> （也是默认的策略），使用的是<a href="https://javabetter.cn/thread/lock.html" target="_blank" rel="noopener noreferrer">锁</a>的机制，对 CPU 的使用率不高。</p><p>于是我将等待策略调整为 <code>BlockingWaitStrategy</code>。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-12912ce3-a702-4bb2-a19b-816c22f7d43a.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>运行后的结果如下：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-b4aad83e-af9d-48fc-bcd0-ad2a42588179.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>和刚才的结果对比，发现 CPU 的使用率有明显的降低；同时 dump 线程后，发现大部分线程都处于 waiting 状态。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-56dc1513-8f10-422f-bb2a-ae5dcfb8413f.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="优化解决" tabindex="-1"><a class="header-anchor" href="#优化解决"><span>优化解决</span></a></h3><p>看样子，将等待策略换为 <code>BlockingWaitStrategy</code> 可以减缓 CPU 的使用，不过我留意到官方对 <code>YieldingWaitStrategy</code> 的描述是这样的： 当消费线程（Event Handler threads）的数量小于 CPU 核心数时推荐使用该策略。</p><p>而现在的使用场景是，消费线程数已经大大的超过了核心 CPU 数，因为我的使用方式是一个 <code>Disruptor</code> 队列一个消费者，所以我将队列调整为 1 个又试了试(策略依然是 <code>YieldingWaitStrategy</code>)。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-b1cbc2c2-828a-46e8-ba14-86cd0fa660c6.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>查看运行效果：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-f8fb7682-a61a-407d-923c-890a16bce109.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>跑了一分钟，发现 CPU 的使用率一直都比较平稳。</p><h2 id="小结" tabindex="-1"><a class="header-anchor" href="#小结"><span>小结</span></a></h2><p>排查到此，可以得出结论了，想要根本解决这个问题需要将我们现有的业务拆分；现在是一个应用里同时处理了 N 个业务，每个业务都会使用好几个 <code>Disruptor</code> 队列。</p><p>由于在一台服务器上运行，所以就会导致 CPU 的使用率居高不下。</p><p>由于是老系统，所以我们的调整方式如下：</p><ul><li>先将等待策略调整为 <code>BlockingWaitStrategy</code>，可以有效降低 CPU 的使用率（业务上也还能接受）。</li><li>第二步就需要将应用拆分，一个应用处理一种业务类型；然后分别部署，这样可以互相隔离互不影响。</li></ul><p>当然还有一些其他的优化，比如说这次 dump 发现应用程序创建了 800+ 个线程。创建线程池的方式也是核心线程数和最大线程数一样，就导致一些空闲的线程得不到回收。应该将创建线程池的方式调整一下，将线程数降下来，尽量物尽其用。</p><p>好，生产环境中，一般也就是会遇到 OOM 和 CPU 这两个问题，那也希望这种排查思路能够给大家一些启发~</p><blockquote><ul><li>演示代码已上传至 GitHub：<a href="https://github.com/crossoverJie/JCSprout/tree/master/src/main/java/com/crossoverjie/disruptor" target="_blank" rel="noopener noreferrer">https://github.com/crossoverJie/JCSprout</a></li><li>参考链接：crossoverJie 的<a href="https://github.com/crossoverJie/JCSprout/blob/master/docs/jvm/cpu-percent-100.md" target="_blank" rel="noopener noreferrer">CPU 100% 排查</a></li></ul></blockquote><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第一版 PDF 终于来了！包括Java基础语法、数组&amp;字符串、OOP、集合框架、Java IO、异常处理、Java 新特性、网络编程、NIO、并发编程、JVM等等，共计 32 万余字，500+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/overview/" target="_blank" rel="noopener noreferrer">太赞了，GitHub 上标星 10000+ 的 Java 教程</a></p><p>微信搜 <strong>沉默王二</strong> 或扫描下方二维码关注二哥的原创公众号沉默王二，回复 <strong>222</strong> 即可免费领取。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,82),l=[n];function p(h,r){return a(),s("div",null,l)}const c=i(t,[["render",p],["__file","cpu-percent-100.html.vue"]]),g=JSON.parse('{"path":"/jvm/cpu-percent-100.html","title":"一次生产环境中 CPU 占用 100% 排查优化实践","lang":"zh-CN","frontmatter":{"title":"一次生产环境中 CPU 占用 100% 排查优化实践","shortTitle":"CPU 100%排查优化实战","category":["Java核心"],"tag":["Java虚拟机"],"description":"本文介绍了一次生产环境中 CPU 占用 100% 排查优化实践。","head":[["meta",{"name":"keywords","content":"Java,JavaSE,教程,二哥的Java进阶之路,jvm,Java虚拟机,cpu"}],["meta",{"property":"og:url","content":"https://javabetter.cn/jvm/cpu-percent-100.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"一次生产环境中 CPU 占用 100% 排查优化实践"}],["meta",{"property":"og:description","content":"本文介绍了一次生产环境中 CPU 占用 100% 排查优化实践。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-e9b35104-fce9-40ea-ae91-8bbb7fd8aa96.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Java虚拟机"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"一次生产环境中 CPU 占用 100% 排查优化实践\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-e9b35104-fce9-40ea-ae91-8bbb7fd8aa96.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-f8b051d5-f28d-481e-a0b2-e97151797e3b.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-d6c9bc1c-9600-47f2-9ff1-d0c9bd8ef849.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-49840c0d-2c10-4bcb-80c6-1df7553ddb6c.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-7f3b2fa6-6505-4b67-9f42-0170a236832b.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-d597089d-54e0-49ef-a0f9-41798e84de48.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-97b88b4d-2d81-47ab-9beb-830ac122c282.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-c0ee1da2-29af-4581-b0d8-97f6250401e7.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-de904a90-8b59-4333-82f5-9ec94a6525a0.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-3faf6f7e-0d2c-4cfe-8e3a-07e15601485d.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-12912ce3-a702-4bb2-a19b-816c22f7d43a.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-b4aad83e-af9d-48fc-bcd0-ad2a42588179.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-56dc1513-8f10-422f-bb2a-ae5dcfb8413f.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-b1cbc2c2-828a-46e8-ba14-86cd0fa660c6.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/cpu-percent-100-f8fb7682-a61a-407d-923c-890a16bce109.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"解决问题","slug":"解决问题","link":"#解决问题","children":[{"level":3,"title":"本地模拟","slug":"本地模拟","link":"#本地模拟","children":[]},{"level":3,"title":"优化解决","slug":"优化解决","link":"#优化解决","children":[]}]},{"level":2,"title":"小结","slug":"小结","link":"#小结","children":[]}],"git":{},"readingTime":{"minutes":7.51,"words":2252},"filePathRelative":"jvm/cpu-percent-100.md","excerpt":"\\n<p>前面给大家讲过一次 <a href=\\"https://javabetter.cn/jvm/oom.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">OOM 的优化排查实战</a>，今天再给大家讲一个 CPU 100% 优化排查实战。</p>\\n<p>收到运维同学的报警，说某些服务器负载非常高，让我们开发定位问题。拿到问题后先去服务器上看了看，发现运行的只有我们的 Java 应用程序。于是先用 <code>ps</code> 命令拿到了应用的 <code>PID</code>。</p>\\n<blockquote>\\n<p>ps：查看进程的命令；PID：进程 ID。<code>ps -ef | grep java</code> 可以查看所有的 Java 进程。前面也曾讲过。</p>\\n</blockquote>"}');export{c as comp,g as data};
