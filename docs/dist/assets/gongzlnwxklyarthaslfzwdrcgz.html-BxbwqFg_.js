import{_ as t}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,o as e,e as i}from"./app-CiW81ZiS.js";const s={},r=i(`<h2 id="工作六年-我学会了用-arthas-来辅助我的日常工作" tabindex="-1"><a class="header-anchor" href="#工作六年-我学会了用-arthas-来辅助我的日常工作"><span>工作六年，我学会了用 Arthas 来辅助我的日常工作</span></a></h2><p><em>很久就想写一篇介绍 Arthas 的文章，虽然 Arthas 已有大量文章介绍；但我依然想结合我的实际工作，来聊聊这款我喜爱的 Java 监控诊断产品。</em></p><blockquote><p>🔊一位 Java 开发者的使用总结，只谈使用经验，不聊原理。</p></blockquote><h2 id="📆-那些辛酸的过往" tabindex="-1"><a class="header-anchor" href="#📆-那些辛酸的过往"><span>📆 那些辛酸的过往</span></a></h2><p><strong><em>历历在目的场景</em>🥹</strong>(❁´◡<code>❁)(❁´◡</code>❁)</p><ul><li>客户线上问题，应该如何复现，让客户再点一下吗？</li><li>异常被吃掉，手足无措，看是哪个家伙写的，竟然是自己！</li><li>排查别人线上的 bug，不仅代码还没看懂，还没一行日志，捏了一把汗！</li><li>预发 debug，稍微时间长点，群里就怨声载道！</li><li>加日志重新部署，半个小时就没了，问题还没有找到，头顶的灯却早已照亮了整层楼......</li><li>线上机器不能 debug，也不能开 debug 端口，重新部署会不会破坏现场呢?</li><li>怀疑入参有问题，怀疑合并代码有问题，怀疑没有部署成功，全是问号......</li><li>一个问题排查一天，被 Diss 排查问题慢......</li></ul><blockquote><p><em>直到我遇到了 Arthas，那些曾经束手无策的问题，都变得轻而易举。于是想把这些遇到的场景和用法做个总结。</em></p></blockquote><h2 id="📕一、通过命令执行方法-vmtool" tabindex="-1"><a class="header-anchor" href="#📕一、通过命令执行方法-vmtool"><span>📕一、通过命令执行方法--vmtool</span></a></h2><p><strong>vmtool 命令是我最喜欢用的，也是用最多的一个命令。通过这个命令执行方法，检查各种不符合预期的分支逻辑，入参出参，以及各种外部依赖接口，甚至还能修改数据等。</strong></p><h4 id="_1-1-场景" tabindex="-1"><a class="header-anchor" href="#_1-1-场景"><span>1.1 场景</span></a></h4><table><thead><tr><th>解决过的场景</th><th>具体描述</th></tr></thead><tbody><tr><td>发布导致线上的缓存 key 错误，需要清理，但过期时间还长，没有删除 key 的远程接口</td><td>通过执行 service 方法，删除缓存 key；另外读取 redis 中的 key 也极其方便</td></tr><tr><td>缺少日志，不知道上游是否返回数据合理</td><td>通过执行方法，确定依赖返回数据不正确</td></tr><tr><td>发布应用同时修改分布式配置，导致推送配置到该节点失败</td><td>通过执行方法，查询配置信息不是最新</td></tr><tr><td>常量值不符合预期，配置在 properties 中的免登 url 失效</td><td>通过执行方法，查询当前常量值，判断读取不合理</td></tr><tr><td>新增配置信息、删除脏数据</td><td>通过接口执行方法，添加了配置、删除了脏数据</td></tr><tr><td>集群环境，想要请求打在指定机器上查看日志</td><td>需要反复请求多次才能命中特定机器查看日志，通过vmtool 执行方法，快速实现日志查看</td></tr><tr><td>出参入参不符合预期</td><td>在调用链路上执行所有可疑方法</td></tr><tr><td>以前需要写 controller 调用触发的测试方法</td><td>直接用这个命令，减少代码，还能测试上下游的各种二方接口，十分方便</td></tr></tbody></table><p><em>案例还有很多很多，因为真的可以拿着入参尽情的 invoke</em></p><p>提升了排查问题、解决问题的效率，也帮助其他人解决他们的问题。不再依赖打印大量日志反复部署服务，也不再申请 debug 端口进行远程 debug ，因为确实方便。</p><h4 id="_1-2-使用" tabindex="-1"><a class="header-anchor" href="#_1-2-使用"><span>1.2 使用</span></a></h4><p>工欲善其事必先利其器，我在 IDEA 装上一个 Arthas 插件，用它来快速复制命令，想执行哪个方法拷贝即可。</p><figure><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a19a329d1834bccab44454f811f01ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1563&amp;h=515&amp;s=88254&amp;e=png&amp;b=3c3f41" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><blockquote><p>上图是使用 Arthas 插件生成执行命令。光标放在执行方法上右击选择 vmtool 即可得到可运行命令。</p></blockquote><p><strong>情景一： 执行的方法是对象</strong>：需要对参数对象赋值，以下图中的方法为例：</p><figure><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da59573084794985be61f1da3bb246f7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2038&amp;h=430&amp;s=106438&amp;e=png&amp;b=3b3b3b" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p><code>queryIBCcContactConfig</code> 方法参数是对象， 首先通过 Arthas 工具查找到参数 <code>IbCcContactConfigParam</code> 的<strong>classLoaderHash</strong>， 如下命令：（sc -d 路径）</p><figure><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35d04f03ee5d44cfbdea15fec56b281e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1507&amp;h=1089&amp;s=629859&amp;e=png&amp;b=101010" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>对参数对象进行字段赋值,方式参考下面加粗部分（ognl方式）：</p><blockquote><p>vmtool  -x 3 -c 76707e36 --action getInstances --className com.xxx.impl.IbCcContactConfigServiceImpl --express &#39;instances[0].queryIbCcContactConfig(<strong>(#demo=new com.xxx.param.IbCcContactConfigParam(), #demo.setContactBizCode(&#39;12345L&#39;),#demo)</strong>)&#39;</p></blockquote><p>情景二、基础类型，比如String、Long、Int。直接填充数值即可</p><table><thead><tr><th>举例</th><th>语句</th><th>描述</th></tr></thead><tbody><tr><td>基础类型，比如String、Int、Long类型等</td><td>vmtool -x 3 --action getInstances --className com.xxl.mq.admin.service.IXxlMqMessageService --express &#39;instances[0].delete(0)&#39;</td><td>执行 IXxlMqMessageService#delete 方法，参数为0</td></tr><tr><td></td><td></td><td></td></tr></tbody></table><table><thead><tr><th>参数</th><th>解释</th></tr></thead><tbody><tr><td>-x 3</td><td>返回参数展开形式的，默认1，如果返回体是对象，建议设置3，方便观察返回结果</td></tr><tr><td>-c xxx</td><td>指定classLoaderHash，如果不指定，new 方法报错</td></tr></tbody></table><h4 id="_1-3-限制" tabindex="-1"><a class="header-anchor" href="#_1-3-限制"><span>1.3 限制</span></a></h4><p>其一、尽量避开 ThreadLocal 。执行线程没有 ThreadLocal 的上下文；</p><p>其二、只能有一个端口，只支持一个arthas-server，用完及时关掉。</p><h4 id="_1-4-扩展" tabindex="-1"><a class="header-anchor" href="#_1-4-扩展"><span>1.4 扩展</span></a></h4><p>使用 getstatic 命令查看静态变量</p><table><thead><tr><th>场景描述</th><th>语句执行</th><th>解释</th></tr></thead><tbody><tr><td>查看静态变量的实际值</td><td>getstatic com.xxx.xxx.interceptor.env.EnvIsolationInterceptor FILL_FIELD_NAME -x 3</td><td>查看 EnvIsolationInterceptor # FILL_FIELD_NAME 的静态变量值</td></tr><tr><td>配置application.properties的免登 uri，发现没有生效</td><td>getstatic com.xxx.sso.filter.InitParamContext excludeList -x 3</td><td>查看自己的免登 uri 是否在集合里面，从而快速定位问题</td></tr><tr><td>修改静态变量值</td><td>ognl -x 3 &#39;#field=@<a href="https://link.juejin.cn?target=mailto%3Acom.xxl.mq.admin.conf.XxlMqBrokerImpl%40class.getDeclaredField" title="mailto:com.xxl.mq.admin.conf.XxlMqBrokerImpl@class.getDeclaredField" target="_blank" rel="noopener noreferrer">com.xxl.mq.admin.conf.XxlMqBrokerImpl@class.getDeclaredField</a>(&quot;ENV&quot;),#field.setAccessible(true),#field.set(null,&quot; &quot;)&#39;</td><td><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d60784f5a53d4326917c49af16a3425d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1737&amp;h=327&amp;s=72781&amp;e=png&amp;b=3c3f41" alt="image.png" loading="lazy"></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><h2 id="🖥️二、热部署-redefine-retransform" tabindex="-1"><a class="header-anchor" href="#🖥️二、热部署-redefine-retransform"><span>🖥️二、热部署 # redefine &amp;&amp; retransform</span></a></h2><p>😭<strong>拍桌子拍大腿感叹发布的的代码少写或者漏写；拍脑门惋惜为啥不多打一行日志；口吐芬芳为什么把判断条件写死......，那些只能发布才能调试、部署一次要半小时的应用，真的会让生命变得廉价。</strong></p><h4 id="_2-1-场景" tabindex="-1"><a class="header-anchor" href="#_2-1-场景"><span>2.1 场景</span></a></h4><table><thead><tr><th>解决过的场景</th><th>描述</th></tr></thead><tbody><tr><td>加日志语句，入参出参观察</td><td>联调查看参数</td></tr><tr><td>将判断条件恒定成了 false，目标分支无法执行，阻塞进度</td><td>修改判断逻辑</td></tr><tr><td>漏写一行赋值代码</td><td>对象自己赋值给自己，字段值为NULL</td></tr><tr><td>研发、联调阶段，代码验证</td><td>需要反复修改代码验证</td></tr><tr><td>测试同学提Bug及时修复验证</td><td>快速修复问题，不影响测试进度</td></tr></tbody></table><p><strong>热部署的优势用过的都说好</strong>👍。</p><h4 id="_2-2-使用" tabindex="-1"><a class="header-anchor" href="#_2-2-使用"><span>2.2 使用</span></a></h4><p>IDEA 集成 ArthasHotSwap 插件，方便快捷：</p><figure><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd3e1fc0dc049e0af782fcf608dd915~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1295&amp;h=561&amp;s=128313&amp;e=png&amp;b=343638" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><blockquote><p>很多公司通过 API 方式已经集成了工具，定制化更好用😄。</p></blockquote><h4 id="_2-3-限制" tabindex="-1"><a class="header-anchor" href="#_2-3-限制"><span>2.3 限制</span></a></h4><ul><li>不允许新增加 field/method</li><li>正在跑的函数，没有退出不能生效</li><li>redefine 和 watch/trace/jad/tt 等命令冲突</li></ul><p>热部署能力，是一个很强大的能力，线上谨慎使用，属于高危操作。</p><h2 id="📑三、ognl-条件过滤" tabindex="-1"><a class="header-anchor" href="#📑三、ognl-条件过滤"><span>📑三、OGNL &amp;&amp; 条件过滤</span></a></h2><p><strong>顶流功能，可以使用 OGNL 解决很多复杂场景，其条件过滤属于绝佳。 适用于 watch、trace、stack、monitor等，有大量请求、 for 场景等。</strong></p><figure><img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55686acfd0fc4ce18990387012c30be4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1019&amp;h=915&amp;s=412228&amp;e=png&amp;b=f9f9f9" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><h4 id="_3-1-场景" tabindex="-1"><a class="header-anchor" href="#_3-1-场景"><span>3.1 场景</span></a></h4><p>条件过滤的适用场景实在太多，简单举例</p><table><thead><tr><th>解决过的场景</th><th>描述</th></tr></thead><tbody><tr><td>想拦截特定参数值的方法入参出参，过滤其他参数请求</td><td>只有特定参数才会被拦截，否则跳过，不影响其他人使用</td></tr><tr><td>拦截特定参数，这个参数方法调用耗时长</td><td>排查到了参数异常情况，特定账号数据量太大</td></tr><tr><td>指定账号登录异常</td><td>通过监控指定 userId 的调用栈，排查问题</td></tr></tbody></table><h4 id="_3-2-使用" tabindex="-1"><a class="header-anchor" href="#_3-2-使用"><span>3.2 使用</span></a></h4><p>条件判断形式：形如 params[0] == &quot;orgIdxxx726&quot; （OGNL）</p><table><thead><tr><th>场景</th><th>案例</th><th>描述</th></tr></thead><tbody><tr><td><strong>watch 命令</strong>：只监控特定组织的数据信息</td><td>watch com.xxx.controller.OrgServiceController getOrgInfo &#39;{params,returnObj,throwExp}&#39; &#39;params[0] == &quot;orgIdxxx726&quot;&#39; -n 5 -x 3</td><td>通过“ &#39;<strong>params[0] == &quot;orgIdxxx726</strong>&quot;&#39;”命令，判断只有当参数为“orgIdxxx726” watch 才生效</td></tr><tr><td><strong>trace 命令</strong>：只有特定组织的数据比较消耗时间</td><td>trace com.xxx.controller.OrgServiceController getOrgInfo &#39;params[0] == &quot;orgIdxxx726&quot;&#39; -n 5 --skipJDKMethod false</td><td>查询只要特定组织耗时长，忽略其他参数，精准定位</td></tr><tr><td><strong>stack 命令</strong>：查看调用栈，非常适合代理调用、AOP、Filter等</td><td>stack com.xxx.controller.OrgServiceController getOrgInfo &#39;params[0] == &quot;orgIdxxx726&quot;&#39; -n 5</td><td>排查调用链路</td></tr></tbody></table><p>更多使用条件判断的案例如下</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">--</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> 判空</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">trace </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">com</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">xxx</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">controller</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">OrgServiceController</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> getOrgInfo</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;params[0] != null&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">--</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> 等于</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">trace </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">*</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">com</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">xxx</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">controller</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">OrgServiceController</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> getOrgInfo </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;params[0] == 1L&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">--</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> 字符串不等于</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">trace </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">com</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">xxx</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">controller</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">OrgServiceController</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> getOrgInfo </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;params[1] != &quot;AA&quot;&#39;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>OGNL 可以组合各种形式的条件判断。非常适合 watch、trace、stack 等场景。</p><h4 id="_3-3-扩展" tabindex="-1"><a class="header-anchor" href="#_3-3-扩展"><span>3.3 扩展</span></a></h4><p><a href="https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Falibaba%2Farthas%2Fissues%2F11" title="https://github.com/alibaba/arthas/issues/11" target="_blank" rel="noopener noreferrer">更多灵活的用法</a></p><p><a href="https://link.juejin.cn?target=https%3A%2F%2Farthas.aliyun.com%2Fdoc%2Fognl.html" title="https://arthas.aliyun.com/doc/ognl.html" target="_blank" rel="noopener noreferrer">ognl | arthas</a></p><h2 id="🔖-四、其他命令汇总" tabindex="-1"><a class="header-anchor" href="#🔖-四、其他命令汇总"><span>🔖 四、其他命令汇总</span></a></h2><h4 id="_4-1-logger" tabindex="-1"><a class="header-anchor" href="#_4-1-logger"><span>4.1 logger</span></a></h4><p>在写代码的时候，也可以刻意加 log.debug 级别的日志。日志级别一般为 info ,当需要排查问题的时候，可以修改日志级别为 debug。</p><table><thead><tr><th>解决过的场景</th><th>描述</th></tr></thead><tbody><tr><td>自定义日志失效，排查日志的实现类由哪个包引入或者提供</td><td>排查间接引入的日志依赖包</td></tr><tr><td>改变当前类的日志级别，查看日志</td><td>将 info 级别修改成 debug 级别</td></tr></tbody></table><div class="language-css line-numbers-mode" data-highlighter="shiki" data-ext="css" data-title="css" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">logger -n com</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">.xxx.controller.OrgServiceControlle</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">通过sc 查看这个类的claasLoaderHash；</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">logger --name ROOT --level debug -c 4839ebd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-2-monitor" tabindex="-1"><a class="header-anchor" href="#_4-2-monitor"><span>4.2 monitor</span></a></h4><p>监控某个方法的调用次数。包括调用次数，平均RT、成功率等信息。在性能调优使用：</p><div class="language-arduino line-numbers-mode" data-highlighter="shiki" data-ext="arduino" data-title="arduino" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>monitor com.XXXX.handler.HandlerManager process  -n 10  --cycle 10</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_4-3-thread" tabindex="-1"><a class="header-anchor" href="#_4-3-thread"><span>4.3 thread</span></a></h4><p>排查线程死锁，以及线程状态：</p><table><thead><tr><th>语句</th><th>详细</th></tr></thead><tbody><tr><td>thread -b</td><td>排查死锁情况，注意，当 Arthas 不能加载的时候，还是继续使用原来的 top 命令那一套排查问题</td></tr><tr><td>thread -n 3</td><td>查询当前最忙的 N 个线程</td></tr></tbody></table><h4 id="_4-4-jad-命令、反编译" tabindex="-1"><a class="header-anchor" href="#_4-4-jad-命令、反编译"><span>4.4 jad 命令、反编译</span></a></h4><table><thead><tr><th>场景</th><th>描述</th></tr></thead><tbody><tr><td>排查 jar 中的 class 文件加载是否符合预期。比如：突然发现某一台机器上的执行结果和其他的机器的结果不一致。</td><td>怀疑机器部署异常</td></tr><tr><td>依赖包冲突，加载类不符合预期或者支合并的时候出错</td><td>检查运行的代码</td></tr></tbody></table><p>案例：springBoot 应用遇到 NoSuchMethodError 等问题，可以使用 Jad 反编译确认，看一下加载的类是否有问题。</p><h4 id="_4-5-watch" tabindex="-1"><a class="header-anchor" href="#_4-5-watch"><span>4.5 watch</span></a></h4><p>watch 用来查看入参出参，配合 OGNL 条件过滤非常实用：</p><div class="language-arduino line-numbers-mode" data-highlighter="shiki" data-ext="arduino" data-title="arduino" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>watch com.xxl.mq.admin.service.IXxlMqMessageService pageList &#39;{params,returnObj,throwExp}&#39;  -n 5  -x 4</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><figure><img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dc1a2af991c4f4282f3624ae0efddf9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1447&amp;h=443&amp;s=57064&amp;e=png&amp;b=ffffff" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>条件判断 #cost&gt;200(单位ms) 表示只有当耗时大于200ms才输出：</p><div class="language-arduino line-numbers-mode" data-highlighter="shiki" data-ext="arduino" data-title="arduino" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>watch demo... primeFactors &#39;{params, returnObj}&#39; &#39;#cost&gt;200&#39; -x 2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如果 x 设置超过 4 也就只展示4。使用 x=4 的情况比较常见，因为展开的信息最多。但需要注意线上数据量太大情况。</p><h4 id="_4-6-tt-time-tunnel" tabindex="-1"><a class="header-anchor" href="#_4-6-tt-time-tunnel"><span>4.6 tt （Time Tunnel）</span></a></h4><p>tt 可以实现重做，实现方法调用；个人比较喜欢 vmtool，不过多介绍， tt 功能也十分强大。</p><h4 id="_4-7-用得不多的命令" tabindex="-1"><a class="header-anchor" href="#_4-7-用得不多的命令"><span>4.7 用得不多的命令</span></a></h4><p>下面几个命令个人用得少，但很重要：</p><table><thead><tr><th>命令</th><th>描述</th></tr></thead><tbody><tr><td>memory</td><td>查看内存信息</td></tr><tr><td>options</td><td>全局开关，jvm 比较高级少用的命令</td></tr><tr><td>sysprop / sysenv</td><td>当前 JVM 的系统属性，环境属性</td></tr><tr><td>profiler</td><td><a href="https://link.juejin.cn?target=https%3A%2F%2Farthas.aliyun.com%2Fdoc%2Fprofiler.html" title="https://arthas.aliyun.com/doc/profiler.html" target="_blank" rel="noopener noreferrer">火焰图</a></td></tr><tr><td>dashboard</td><td><a href="https://link.juejin.cn?target=https%3A%2F%2Farthas.aliyun.com%2Fdoc%2Fdashboard.html" title="https://arthas.aliyun.com/doc/dashboard.html" target="_blank" rel="noopener noreferrer">实时数据面板</a></td></tr></tbody></table><p>其他命令就不再赘述了📎。</p><h4 id="_4-8-arthas-插件功能" tabindex="-1"><a class="header-anchor" href="#_4-8-arthas-插件功能"><span>4.8 Arthas 插件功能</span></a></h4><p>Arthas 插件生成的命令如下：</p><figure><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1eeb9c5772914b17b466ac427bb3e9a2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1745&amp;h=1511&amp;s=502786&amp;e=png&amp;b=fcfcfc" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><blockquote><p>注：图片来源于 <a href="https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2FWangJi92%2Farthas-idea-plugin%2Fblob%2Fmaster%2FREADME.md" title="https://github.com/WangJi92/arthas-idea-plugin/blob/master/README.md" target="_blank" rel="noopener noreferrer">arthas 插件作者</a>，插件和文章都很好🌺</p></blockquote><p>针对插件的热部署配置详见： <a href="https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Farthas-idea-plugin%2Fhelp%2Fpwxhb4" title="https://www.yuque.com/arthas-idea-plugin/help/pwxhb4" target="_blank" rel="noopener noreferrer">(Hot Swap) Redefine 热更新支持</a>)； 个人更推荐热部署用 ArthasHotSwap 插件。</p><h2 id="📌五、一些限制-注意事项" tabindex="-1"><a class="header-anchor" href="#📌五、一些限制-注意事项"><span>📌五、一些限制 &amp;&amp; 注意事项</span></a></h2><ul><li>执行trace / tt 等命令时，本质上是在 method 的前后插入代码，会影响原来 JVM 里面 JIT 编译生成的代码。可能执行并发高的函数有抖动；</li><li>只能有一个端口，只支持一个 arthas-server；</li><li>热部署有限制且不一定能成功，线上属于高危操作；</li><li>如果服务不能响应，可能 Arthas 不能启动使用，需要使用 Linux 相关命令排查问题。</li></ul><h2 id="📇六、好文推荐" tabindex="-1"><a class="header-anchor" href="#📇六、好文推荐"><span>📇六、好文推荐</span></a></h2><ol><li><a href="https://link.juejin.cn?target=https%3A%2F%2Farthas.aliyun.com%2F" title="https://arthas.aliyun.com/" target="_blank" rel="noopener noreferrer">官网文档</a></li><li><a href="https://link.juejin.cn?target=https%3A%2F%2Fwww.yuque.com%2Farthas-idea-plugin%2Fhelp%2Fpe6i45" title="https://www.yuque.com/arthas-idea-plugin/help/pe6i45" target="_blank" rel="noopener noreferrer">个人最推荐的学习资料： arthas idea plugin手册</a></li></ol><h2 id="🧣七、最后的话" tabindex="-1"><a class="header-anchor" href="#🧣七、最后的话"><span>🧣七、最后的话</span></a></h2><p>🖲要成为 Arthas 使用的好手，一定多多练习：<strong>纸上得来终觉浅，绝知此事要躬行</strong>。</p><blockquote><p>参考链接：<a href="https://juejin.cn/post/7291931708920512527#heading-2" target="_blank" rel="noopener noreferrer">https://juejin.cn/post/7291931708920512527#heading-2</a>，整理：沉默王二</p></blockquote>`,98),n=[r];function l(d,p){return e(),a("div",null,n)}const c=t(s,[["render",l],["__file","gongzlnwxklyarthaslfzwdrcgz.html.vue"]]),g=JSON.parse('{"path":"/nice-article/juejin/gongzlnwxklyarthaslfzwdrcgz.html","title":"工作六年，我学会了用 Arthas 来辅助我的日常工作","lang":"zh-CN","frontmatter":{"title":"工作六年，我学会了用 Arthas 来辅助我的日常工作","shortTitle":"工作六年，我学会了用 Arthas 来辅助我的日常工作","description":"如何通过 arthas 来解决日常工作中的疑难问题，如何通过 arthas 处理工作以前需要 debug，需要打印日志才能找的 bug。 集合案例来谈谈如何使用 arthas 这些命令。","tag":["优质文章"],"author":"uzong","category":["掘金社区"],"head":[["meta",{"name":"keywords","content":"Java"}],["meta",{"property":"og:url","content":"https://javabetter.cn/nice-article/juejin/gongzlnwxklyarthaslfzwdrcgz.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"工作六年，我学会了用 Arthas 来辅助我的日常工作"}],["meta",{"property":"og:description","content":"如何通过 arthas 来解决日常工作中的疑难问题，如何通过 arthas 处理工作以前需要 debug，需要打印日志才能找的 bug。 集合案例来谈谈如何使用 arthas 这些命令。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a19a329d1834bccab44454f811f01ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1563&h=515&s=88254&e=png&b=3c3f41"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"uzong"}],["meta",{"property":"article:tag","content":"优质文章"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"工作六年，我学会了用 Arthas 来辅助我的日常工作\\",\\"image\\":[\\"https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9a19a329d1834bccab44454f811f01ec~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1563&h=515&s=88254&e=png&b=3c3f41\\",\\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da59573084794985be61f1da3bb246f7~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=2038&h=430&s=106438&e=png&b=3b3b3b\\",\\"https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35d04f03ee5d44cfbdea15fec56b281e~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1507&h=1089&s=629859&e=png&b=101010\\",\\"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d60784f5a53d4326917c49af16a3425d~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1737&h=327&s=72781&e=png&b=3c3f41\\",\\"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dd3e1fc0dc049e0af782fcf608dd915~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1295&h=561&s=128313&e=png&b=343638\\",\\"https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/55686acfd0fc4ce18990387012c30be4~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1019&h=915&s=412228&e=png&b=f9f9f9\\",\\"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9dc1a2af991c4f4282f3624ae0efddf9~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1447&h=443&s=57064&e=png&b=ffffff\\",\\"https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1eeb9c5772914b17b466ac427bb3e9a2~tplv-k3u1fbpfcp-jj-mark:3024:0:0:0:q75.awebp#?w=1745&h=1511&s=502786&e=png&b=fcfcfc\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"uzong\\"}]}"]]},"headers":[{"level":2,"title":"工作六年，我学会了用 Arthas 来辅助我的日常工作","slug":"工作六年-我学会了用-arthas-来辅助我的日常工作","link":"#工作六年-我学会了用-arthas-来辅助我的日常工作","children":[]},{"level":2,"title":"📆 那些辛酸的过往","slug":"📆-那些辛酸的过往","link":"#📆-那些辛酸的过往","children":[]},{"level":2,"title":"📕一、通过命令执行方法--vmtool","slug":"📕一、通过命令执行方法-vmtool","link":"#📕一、通过命令执行方法-vmtool","children":[]},{"level":2,"title":"🖥️二、热部署 # redefine && retransform","slug":"🖥️二、热部署-redefine-retransform","link":"#🖥️二、热部署-redefine-retransform","children":[]},{"level":2,"title":"📑三、OGNL && 条件过滤","slug":"📑三、ognl-条件过滤","link":"#📑三、ognl-条件过滤","children":[]},{"level":2,"title":"🔖 四、其他命令汇总","slug":"🔖-四、其他命令汇总","link":"#🔖-四、其他命令汇总","children":[]},{"level":2,"title":"📌五、一些限制 && 注意事项","slug":"📌五、一些限制-注意事项","link":"#📌五、一些限制-注意事项","children":[]},{"level":2,"title":"📇六、好文推荐","slug":"📇六、好文推荐","link":"#📇六、好文推荐","children":[]},{"level":2,"title":"🧣七、最后的话","slug":"🧣七、最后的话","link":"#🧣七、最后的话","children":[]}],"git":{},"readingTime":{"minutes":11.15,"words":3346},"filePathRelative":"nice-article/juejin/gongzlnwxklyarthaslfzwdrcgz.md","excerpt":"<h2>工作六年，我学会了用 Arthas 来辅助我的日常工作</h2>\\n<p><em>很久就想写一篇介绍 Arthas 的文章，虽然 Arthas 已有大量文章介绍；但我依然想结合我的实际工作，来聊聊这款我喜爱的 Java 监控诊断产品。</em></p>\\n<blockquote>\\n<p>🔊一位 Java 开发者的使用总结，只谈使用经验，不聊原理。</p>\\n</blockquote>\\n<h2>📆 那些辛酸的过往</h2>\\n<p><strong><em>历历在目的场景</em>🥹</strong>(❁´◡<code>❁)(❁´◡</code>❁)</p>\\n<ul>\\n<li>客户线上问题，应该如何复现，让客户再点一下吗？</li>\\n<li>异常被吃掉，手足无措，看是哪个家伙写的，竟然是自己！</li>\\n<li>排查别人线上的 bug，不仅代码还没看懂，还没一行日志，捏了一把汗！</li>\\n<li>预发 debug，稍微时间长点，群里就怨声载道！</li>\\n<li>加日志重新部署，半个小时就没了，问题还没有找到，头顶的灯却早已照亮了整层楼......</li>\\n<li>线上机器不能 debug，也不能开 debug 端口，重新部署会不会破坏现场呢?</li>\\n<li>怀疑入参有问题，怀疑合并代码有问题，怀疑没有部署成功，全是问号......</li>\\n<li>一个问题排查一天，被 Diss 排查问题慢......</li>\\n</ul>"}');export{c as comp,g as data};
