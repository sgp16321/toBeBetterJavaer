import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as a,e}from"./app-CiW81ZiS.js";const n={},t=e(`<p>作为一名富有责任心的技术博主，我觉得有必要把我入门 Redis 的过程分享出来，供一些小伙伴作为参考。要是我哪里写错了，别客气，过来给我一巴掌，就行了（温柔点，别打肿，影响颜值就不好了）。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-fe7d042b-efed-469c-9460-fb3bc1d4c041.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>前面我们已经讲了 Redis 的安装，参考这里：<a href="https://javabetter.cn/redis/install.html" target="_blank" rel="noopener noreferrer">Redis 安装，超详细</a></p><h2 id="_01、redis-的数据结构" tabindex="-1"><a class="header-anchor" href="#_01、redis-的数据结构"><span>01、Redis 的数据结构</span></a></h2><p>Redis 有 5 种基础数据结构，String、Hash、List、Set、SortedSet，也是学 Redis 必须掌握的。除此之外，还有 HyperLogLog、Geo、Pub/Sub，算是高级数据结构了。我们这篇入门的文章就以 String 为例吧。</p><p>String 结构使用非常广泛，比如说把用户的登陆信息转成 JSON 字符串后缓存起来，等需要取出的时候再反序列化一次。</p><p>小伙伴们应该都知道，Java 的 String 是不可变的，无法修改。Redis 的 String 是动态的，可以修改的，两者不同哦。关于 Redis 的 String 结构，我觉得老钱的 Redis 教程上讲得非常明白，大家一起拜读下。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-d9aca13e-053e-4aea-a8cb-d77b01e5035a.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><blockquote><p>Redis 的 String 在内部结构实现上类似于 Java 的 ArrayList，采用预分配冗余空间的方式来减少内存的频繁分配。如上图所示，当前字符串实际分配的空间为 capacity，一般高于实际的字符串长度 len。当字符串长度小于 1M 时，扩容是对现有空间的成倍增长；如果长度超过 1M 时，扩容一次只会多增加 1M 的空间。最大长度为 512M。</p></blockquote><h2 id="_02、实操-redis" tabindex="-1"><a class="header-anchor" href="#_02、实操-redis"><span>02、实操 Redis</span></a></h2><p>好了好了，我估计很多小伙伴们已经整装待发，准备实操一把了。这就来。</p><p>进入 redis-cli 命令行客户端（怎么进入，前面<a href="https://javabetter.cn/redis/install.html" target="_blank" rel="noopener noreferrer">安装环节</a>已经讲过了），这个客户端还是非常智能的，当键入命令的时候，会跳出对应的提示</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-6ca5d00d-4b5d-4475-a49c-9937e22f97af.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>当按下空格跟进关键字的时候，对应位置上的提示会自动消失。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-656ec70a-c053-44ab-b078-a5c77386bee6.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>以下是完整的键值对测试命令，小伙伴们可以按照格式动手实操一把。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&gt; set name cmower</span></span>
<span class="line"><span>OK</span></span>
<span class="line"><span>&gt; get name</span></span>
<span class="line"><span>&quot;cmower&quot;</span></span>
<span class="line"><span>&gt; exists name</span></span>
<span class="line"><span>(integer) 1</span></span>
<span class="line"><span>&gt; del name</span></span>
<span class="line"><span>(integer) 1</span></span>
<span class="line"><span>&gt; get name</span></span>
<span class="line"><span>(nil)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1）set 命令用来存储一个键值对，在本例中，name 为 key，cmower 为 值。</p><p>2）get 命令用来获取一个键值对。</p><p>3）exists 命令用来测试一个键值对是否存在，<code>(integer) 1</code> 表示存在，<code>(integer) 0</code> 表示不存在。</p><p>4）del 命令用来删除一个键值对，<code>(integer) 1</code> 表示执行成功，<code>(integer) 0</code> 表示执行失败。</p><p>5）当键值对删除后，再通过 get 命令获取时，结果就为 <code>(nil)</code> 。</p><p>可能有小伙伴会好奇，<code>nil</code> 是什么意思？它是 Objective-C、Swift、Ruby、Lua 等编程语言中的一个关键字，更详细的解释可以看一下《Programming in Lua 程序设计第二版》：</p><blockquote><p>nil 是一种类型，它只有一个值 nil，它的主要功能是用于区别其他任何值，就像之前所说的，一个全局变量在第一次赋值前的默认值就是 nil，将 nil 赋予一个全局变量等同于删除它，Lua 将 nil 用于表示一种“无效值(non-value)”的情况，即没有任何有效值的情况。</p></blockquote><p>想了解 Redis 命令的具体使用方法，可以参考以下链接：</p><blockquote><p><a href="http://redisdoc.com/index.html" target="_blank" rel="noopener noreferrer">http://redisdoc.com/index.html</a></p></blockquote><p>是 <a href="http://redis.io/commands" target="_blank" rel="noopener noreferrer">Redis Command Reference</a> 和 <a href="http://redis.io/documentation" target="_blank" rel="noopener noreferrer">Redis Documentation</a> 的中文翻译版，良心吧？</p><h2 id="_03、在-java-中使用-redis" tabindex="-1"><a class="header-anchor" href="#_03、在-java-中使用-redis"><span>03、在 Java 中使用 Redis</span></a></h2><p>有些小伙伴可能会问，“二哥，我是一名 Java 程序员，我该如何在 Java 中使用 Redis 呢？”这个问题问得好，这就来，这就来。</p><p>第一步，在项目中添加 Jedis（Java 和 Redis 的混拼） 依赖：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;redis.clients&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;jedis&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;3.2.0&lt;/version&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步，新建 UserInfo（用户信息）类：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> UserInfo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> age</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> UserInfo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">int</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;"> age</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">name</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> name;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">age</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> age;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    @</span><span style="--shiki-light:#A626A4;--shiki-dark:#E5C07B;">Override</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> String</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> toString</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        return</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;UserInfo{&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                &quot;name=&#39;&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> name </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">\\&#39;</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                &quot;, age=&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> age </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">+</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                &#39;}&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">    // getter / setter</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第三步，在项目中添加 Gson（用于序列化和反序列化用户信息） 依赖：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;dependency&gt;</span></span>
<span class="line"><span>    &lt;groupId&gt;com.google.code.gson&lt;/groupId&gt;</span></span>
<span class="line"><span>    &lt;artifactId&gt;gson&lt;/artifactId&gt;</span></span>
<span class="line"><span>    &lt;version&gt;2.8.6&lt;/version&gt;</span></span>
<span class="line"><span>    &lt;scope&gt;compile&lt;/scope&gt;</span></span>
<span class="line"><span>&lt;/dependency&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第四步，新建测试类 RedisTest：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> RedisTest</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> String</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> REDIS_KEY </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &quot;user&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> main</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[] </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">args</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">        Jedis</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;localhost&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">6379</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">        Gson</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> gson</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Gson</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">        UserInfo</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> userInfo</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> UserInfo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;沉默王二&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">18</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">set</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(REDIS_KEY, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">gson</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">toJson</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(userInfo));</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">        UserInfo</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> getUserInfoFromRedis</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> gson</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">fromJson</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(REDIS_KEY),</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">UserInfo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;get：&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> getUserInfoFromRedis);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;exists：&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">exists</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(REDIS_KEY));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;del：&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">del</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(REDIS_KEY));</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        System</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">out</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">println</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;get：&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> +</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(REDIS_KEY));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>1）REDIS_KEY 常量为存储用户信息到 Redis 的 key。</p><p>2）在 Jedis 的帮助下，Java 连接 Redis 服务变得非常简单，只需要一行代码：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Jedis</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> jedis </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Jedis</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;localhost&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 6379</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>参数分别是主机名，端口号。</p><p>存储键值对用 <code>set()</code> 方法，获取键值对用 <code>get()</code> 方法，判断键值对是否存在用 <code>exists()</code> 方法，删除键值对用 <code>del()</code> 方法。</p><p>3）<a href="https://javabetter.cn/gongju/gson.html" target="_blank" rel="noopener noreferrer">Gson</a> 是谷歌提供的一个开源库，可以将 Java 对象序列化为 JSON 字符串，同样可以将 JSON 字符串反序列化（解析）为匹配的 Java 对象。</p><p>使用起来也非常简单，<code>toJson()</code> 方法将对象转成 JSON 字符串，<code>fromJson()</code> 方法将 JSON 字符串反序列化对象。</p><p>好了，来看一下程序的输出结果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>get：UserInfo{name=&#39;沉默王二&#39;, age=18}</span></span>
<span class="line"><span>exists：true</span></span>
<span class="line"><span>del：1</span></span>
<span class="line"><span>get：null</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完全符合我们的预期，perfect！</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-7135d995-f563-4021-b364-411b1be07b5a.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_04、鸣谢" tabindex="-1"><a class="header-anchor" href="#_04、鸣谢"><span>04、鸣谢</span></a></h2><p>好了，我亲爱的小伙伴们，以上就是本文的全部内容了，是不是看完后很想实操一把 Redis，赶快行动吧！如果你在学习的过程中遇到了问题，欢迎随时和我交流，虽然我也是个菜鸟，但我有热情啊。</p><p>另外，如果你想写入门级别的文章，这篇就是最好的范例。</p><hr><p>GitHub 上标星 10000+ 的开源知识库《<a href="https://github.com/itwanger/toBeBetterJavaer" target="_blank" rel="noopener noreferrer">二哥的 Java 进阶之路</a>》第一版 PDF 终于来了！包括Java基础语法、数组&amp;字符串、OOP、集合框架、Java IO、异常处理、Java 新特性、网络编程、NIO、并发编程、JVM等等，共计 32 万余字，500+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：<a href="https://javabetter.cn/overview/" target="_blank" rel="noopener noreferrer">太赞了，GitHub 上标星 10000+ 的 Java 教程</a></p><p>微信搜 <strong>沉默王二</strong> 或扫描下方二维码关注二哥的原创公众号沉默王二，回复 <strong>222</strong> 即可免费领取。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,55),l=[t];function p(h,r){return a(),i("div",null,l)}const g=s(n,[["render",p],["__file","rumen.html.vue"]]),c=JSON.parse('{"path":"/redis/rumen.html","title":"史上最通俗易懂的 Redis 入门教程","lang":"zh-CN","frontmatter":{"title":"史上最通俗易懂的 Redis 入门教程","shortTitle":"Redis 入门","category":["Redis"],"tag":["Redis"],"description":"本文是一篇通俗易懂、风趣幽默的 Redis 入门教程，内容涵盖 Redis 是什么、安装 Redis、Redis 的数据结构、实操 Redis、在 Java 中使用 Redis 等核心知识点。学 Redis，就认准二哥的 Java 进阶之路😄。","head":[["meta",{"name":"keywords","content":"Java,ArrayDeque,堆,队列,java 双端队列,java ArrayDeque,源码分析, 实现原理"}],["meta",{"property":"og:url","content":"https://javabetter.cn/redis/rumen.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"史上最通俗易懂的 Redis 入门教程"}],["meta",{"property":"og:description","content":"本文是一篇通俗易懂、风趣幽默的 Redis 入门教程，内容涵盖 Redis 是什么、安装 Redis、Redis 的数据结构、实操 Redis、在 Java 中使用 Redis 等核心知识点。学 Redis，就认准二哥的 Java 进阶之路😄。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-fe7d042b-efed-469c-9460-fb3bc1d4c041.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"Redis"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"史上最通俗易懂的 Redis 入门教程\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-fe7d042b-efed-469c-9460-fb3bc1d4c041.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-d9aca13e-053e-4aea-a8cb-d77b01e5035a.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-6ca5d00d-4b5d-4475-a49c-9937e22f97af.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-656ec70a-c053-44ab-b078-a5c77386bee6.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-7135d995-f563-4021-b364-411b1be07b5a.jpg\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"01、Redis 的数据结构","slug":"_01、redis-的数据结构","link":"#_01、redis-的数据结构","children":[]},{"level":2,"title":"02、实操 Redis","slug":"_02、实操-redis","link":"#_02、实操-redis","children":[]},{"level":2,"title":"03、在 Java 中使用 Redis","slug":"_03、在-java-中使用-redis","link":"#_03、在-java-中使用-redis","children":[]},{"level":2,"title":"04、鸣谢","slug":"_04、鸣谢","link":"#_04、鸣谢","children":[]}],"git":{},"readingTime":{"minutes":5.77,"words":1732},"filePathRelative":"redis/rumen.md","excerpt":"<p>作为一名富有责任心的技术博主，我觉得有必要把我入门 Redis 的过程分享出来，供一些小伙伴作为参考。要是我哪里写错了，别客气，过来给我一巴掌，就行了（温柔点，别打肿，影响颜值就不好了）。</p>\\n<figure><img src=\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/redis/rumen-fe7d042b-efed-469c-9460-fb3bc1d4c041.jpg\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>"}');export{g as comp,c as data};
