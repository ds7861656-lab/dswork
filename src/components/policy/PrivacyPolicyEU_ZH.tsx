import React from 'react';
import { Section, SubSection } from '../../components/policy/Section';
import { PermissionsTable } from '../../components/policy/PermissionsTable';
import { permissionDataEU_ZH } from '../../components/policy/permissionData';

export const PrivacyPolicyEU_ZH: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-blue-900 text-white p-8 -mx-8 -mt-8 mb-8 rounded-t-2xl">
        <h1 className="text-3xl font-bold mb-2">afreshtrip 隐私政策 (欧盟版)</h1>
        <p className="opacity-90 text-sm">适用范围：欧盟地区 (遵循 GDPR) | 版本：EU-2025-V1</p>
      </div>

      <Section title="引言">
        <p>
          欢迎您使用afreshtrip软件及相关服务！afreshtrip是由安思达乐（杭州）信息科技有限公司进行开发并运营的一款旅游路线规划软件，我们的地址为xxxxxxxxxxxxxxxx，我们深知个人信息对您的重要性，也深知您的信任对我们至关重要。我们坚信：隐私和安全是用户体验的基石。
        </p>
        <p className="mt-4">
          因此，我们制定了本《afreshtrip基本功能隐私政策》（以下简称"本政策"），<strong>旨在以清晰、透明的方式，向您说明您在使用 afreshtrip服务时，我们如何收集、使用、存储、保护和共享您的个人信息，并告知您享有的权利。</strong>
        </p>
        <p className="mt-4">
          <strong>请您在使用我们的服务前，仔细阅读、充分理解本政策的全部内容，特别是以加粗或下划线等形式提示您注意的条款。</strong>
        </p>
        <div className="bg-slate-50 border border-slate-200 p-4 my-4 rounded-md">
          <p className="text-sm font-bold text-slate-700 mb-2">在开始使用前，希望您能够自主同意以下条款：</p>
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input type="checkbox" disabled checked className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-slate-700">您已经仔细阅读并同意《afreshtrip隐私政策》</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" disabled checked className="w-5 h-5 text-blue-600 rounded" />
              <span className="text-slate-700">您同意在符合法规的情况下与第三方共享您的数据</span>
            </label>
          </div>
        </div>
        <p className="mt-4">
          您的同意是我们启动服务的第一步。这意味着我们可以为您提供主要服务（如基础地图和路线规划）并使用必要的信息。为了给您带来更丰富的体验，我们的一些额外功能可能会需要使用其他信息。<strong>当使用到这些功能时，我们将会弹窗询问您，在获得您的明确点头后才会开启。</strong>
        </p>
      </Section>

      <Section title="一、个人信息收集与使用场景">
        <p>
          安思达乐（杭州）信息科技有限公司（以下简称"我们"）作为数据控制者，严格遵守欧盟《通用数据保护条例》（GDPR）。本章节旨在清晰地告知您，我们如何收集和使用您的个人数据，以及每一项处理活动的法律依据。
        </p>
        
        <SubSection title="1.1 为您提供核心功能">
          <p><strong>位置信息：</strong>在您授权后，我们会通过IP地址、GPS、Wi-Fi接入点等方式收集您的精确或大致地理位置，这是本服务的核心，用于为您规划从您当前位置到目的地的路线。</p>
          <p className="mt-2"><strong>搜索与浏览信息：</strong>当您使用搜索框或浏览推荐景点时，我们会收集您的搜索关键词、浏览记录。用于向您提供更精准的搜索结果，了解您的兴趣偏好，以优化未来向您展示的内容。</p>
          <p className="mt-2"><strong>账号信息：</strong>当您注册账号以同步或备份行程时，我们需要您提供手机号码，用于创建账号、验证身份、保障账号安全。</p>
        </SubSection>

        <SubSection title="1.2 服务优化与安全保障 (GDPR 第6条(1)(f))">
          <p>
            为了提升服务质量、保障所有用户的安全和体验，我们基于"合法利益"处理以下数据。您有权通过【我的-设置-隐私中心】反对此类处理。以下数据包括：数据类型、处理目的与利益权衡、设备标识符(如Android ID)、IP地址、粗略位置（基于IP）。
          </p>
          <p className="mt-2">
            <strong>我们的主要目的是分析应用崩溃原因、防范网络攻击（如DDoS）、诊断欺诈行为。为了保证您的数据安全，我们已通过数据匿名化、最小化采集等方式，确保对您隐私的影响降至最低。</strong>
          </p>
        </SubSection>

        <SubSection title="1.3 个性化推荐与营销">
          <p>
            为了向您提供更契合您喜好的内容，我们可能会基于您的位置信息、搜索记录、收藏地点，通过算法分析您的偏好，为您推荐可能感兴趣的个性化旅行路线、景点或酒店。请注意，此类个性化推荐功能非核心功能所必需。
          </p>
          <p className="mt-2">
            <strong>我们将在首次为您推荐前弹窗并单独征得您的同意。您可以在【我的-设置-隐私中心】中随时关闭此功能。</strong>
          </p>
        </SubSection>

        <SubSection title="1.4 特殊类别数据处理">
          <p>
            原则上，我们不会处理任何特殊类别个人数据（如种族、政治观点、健康数据等）。<strong>若您自行在评论、个人资料或其他可公开访问的区域主动上传或披露此类信息，则视为您已明确同意其公开。请您谨慎对待此类信息。</strong>
          </p>
        </SubSection>

        <SubSection title="1.5 权限清单">
          <PermissionsTable items={permissionDataEU_ZH} />
        </SubSection>
      </Section>

      <Section title="二、个人信息的共享、公开披露与委托处理">
        <SubSection title="2.1 数据委托处理">
          <p>
            <strong>我们委托的第三方数据处理者仅能根据我们发出的详尽书面指令处理您的个人数据。我们与每一位处理者均签订了完全符合GDPR要求的数据处理协议。</strong>我们要求其只能出于提供特定服务之目的处理您的信息，并采取与其处理活动相适应的、符合行业标准的技术和管理安全措施，以防止信息泄露和滥用。并在在委托关系结束后及时删除或匿名化处理信息。
          </p>
          <p className="mt-2">
            我们仅选择那些能够提供充分安全保障承诺的、信誉良好的服务商，并对其数据处理活动负有最终责任。
          </p>
        </SubSection>

        <SubSection title="2.2 与独立控制者共享（基于您的单独同意）">
          <p>
            我们可能与我们的关联公司（指现在或未来与安思达乐公司存在控制、受控制或共同受控制关系的法律实体）共享您的个人信息。共享将严格限于实现本隐私政策所述目的之必要范围内。关联公司将同样受到本隐私政策的约束，并遵循相同的安全保障标准和保密义务。
          </p>
          <p className="mt-2">
            <strong>在任何此类数据共享发生之前，我们征求您的明确且知情的同意。您可以在【我的-设置-隐私中心】关闭此同意。</strong>
          </p>
        </SubSection>

        <SubSection title="2.3 跨境数据传输的法律保障机制">
          <p>
            由于我们的部分服务提供商可能位于欧盟以外的国家或地区，您的个人数据可能会被传输至这些地区。<strong>所有此类传输均确保依托于欧盟委员会认可的适当法律保障措施执行，以确保您的数据持续受到保护。</strong>
          </p>
          <p className="mt-2">
            <strong>我们的核心法律工具是采用欧盟委员会通过的《标准合同条款》。我们与每一位第三国接收方皆签署了包含SCCs的数据保护协议，这些条款为其设定了具有法律约束力的数据保护义务。</strong>
          </p>
          <p className="mt-2">
            此外，作为透明度承诺的一部分，您有权通过联系我们的数据保护官（DPO）索取这些SCCs保障措施的核心内容副本，以便详细了解您的数据如何在全球范围内受到保护。联系邮箱：[xxxxxxxxx]，联系电话：[xxxxxxxx]。
          </p>
          <p className="mt-2">
            <strong>我们承诺不会主动将您的个人数据公开披露至任何公开环境（如网站、社交媒体）。唯一例外是，若您自行使用应用的"分享"功能将您的行程主动公开分享至第三方平台，该行为将由您自行负责。</strong>
          </p>
        </SubSection>
      </Section>

      <Section title="三、个人信息的存储与保护">
        <SubSection title="3.1 数据存储期限">
          <p>
            <strong>我们仅按照GDPR所要求的时限内存储您的个人信息。上述期限届满后，我们将对您的个人信息进行删除或匿名化处理。</strong>例如，在您主动注销账号后，我们将在规定的合理期限内对您的个人数据进行安全处置。
          </p>
        </SubSection>

        <SubSection title="3.2 数据存储与跨境传输">
          <p>
            为高效地向您提供服务，您的个人数据将在以下地点进行处理和存储：
          </p>
          <p className="mt-2">
            <strong>主要存储地：</strong>欧盟境内数据中心。所有数据在欧盟境内存储时享受GDPR的直接保护。
          </p>
          <p className="mt-2">
            <strong>跨境传输：</strong>为支持部分全球性功能（如地图服务），我们可能会将部分数据传输至欧盟以外的国家/地区。所有此类传输均确保依托于SCCs保障措施执行，该法律合同为您的数据提供了与欧盟水平相当的保护。
          </p>
        </SubSection>

        <SubSection title="3.3 数据安全保护措施">
          <p>
            我们已采取符合行业标准的安全防护措施，包括但不限于：
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>技术手段：</strong>数据加密传输（如TLS/SSL）、数据加密存储、严格的访问控制机制。</li>
            <li><strong>管理措施：</strong>建立数据安全管理制度、对员工进行安全培训、签署保密协议。</li>
            <li><strong>员工培训：</strong>定期对处理个人数据的员工进行GDPR合规与安全意识培训。</li>
            <li><strong>数据保护影响评估：</strong>在处理高风险活动前，我们会进行DPIA评估。</li>
            <li><strong>应急响应：</strong>我们制定了正式的数据安全事件响应计划，以应对可能的数据泄露。</li>
          </ul>
        </SubSection>

        <SubSection title="3.4 数据泄露通知承诺">
          <p>
            尽管我们采取了上述保护措施，但无法完全杜绝数据泄露的风险。若发生可能对您的权利和自由造成风险的个人数据泄露事件，我们承诺将：
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>1.在知悉后的72小时内，向相关的欧盟数据保护监管机构报告；</strong></li>
            <li><strong>2.如果数据泄露很可能对您造成高风险，我们将通过电子邮件等有效方式告知您此次泄露事件的性质、潜在后果以及我们已采取或建议采取的应对措施。</strong></li>
          </ul>
        </SubSection>
      </Section>

      <Section title="四、您的权利 (GDPR 第三章)">
        <SubSection title="4.1 访问与查询">
          <p>
            您有权访问您的个人信息，并获取其副本。您可以通过App内【我的-设置-隐私中心】页面查看大部分个人信息。如需获取特定信息的副本，可通过文末联系方式向我们提出书面请求。
          </p>
        </SubSection>

        <SubSection title="4.2 更正与补充">
          <p>
            当您发现我们处理的关于您的个人信息不准确、不完整时，您有权要求我们予以更正或补充。您可以在App【我的-设置-隐私中心】内直接修改个人信息（如昵称、头像），或通过客服渠道要求我们更正。
          </p>
        </SubSection>

        <SubSection title="4.3 删除个人信息">
          <p>
            在符合法律法规规定的情形下，您有权请求我们删除您的个人信息。
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>处理目的已实现或不再必要：</strong>当您使用服务的相关处理目的已达成，或者我们不再需要为该目的继续处理您的信息时；</li>
            <li><strong>撤回同意后的处理：</strong>当您收回了对此前信息处理的授权，且该信息不再存在其他合法处理依据时；</li>
            <li><strong>信息处理违反法律规定：</strong>当我们处理您个人信息的行为违反了法律、行政法规或双方的约定时；</li>
            <li><strong>服务已终止：</strong>当我们终止服务运营或保存期限已经届满时。</li>
          </ul>
        </SubSection>

        <SubSection title="4.4 撤回同意">
          <p>
            <strong>您有权随时改变或撤回您此前已授权的同意。</strong>您可以通过设备系统设置关闭位置、相册、相机等权限，或通过App内【我的-设置-隐私中心】关闭个性化推荐等特定功能，从而撤回对该功能继续收集和使用您个人信息的授权。
          </p>
          <p className="mt-2">
            当您发出申请后，我们将会在25天内进行处理并反馈。请注意，撤回同意不影响此前基于您的授权已进行的信息处理活动的效力。
          </p>
        </SubSection>

        <SubSection title="4.5 注销账号">
          <p>
            <strong>您有权注销您在本服务中注册的账号。</strong>您可以通过App内【我的-设置-账号与安全-注销账号】中提供的指引和流程，提交账号注销申请。我们将在验证您的身份后15个工作日内，完成账号注销并删除或匿名化处理您的个人信息。
          </p>
          <p className="mt-2">
            请注意，账号注销是不可恢复的操作，一旦注销，您将无法再使用该账号及与之相关的所有服务与数据。
          </p>
        </SubSection>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="p-3 border rounded bg-slate-50">
            <h4 className="font-bold">数据保护官 (DPO)</h4>
            <p className="text-sm">邮箱：dpo@anstalle.com</p>
            <p className="text-sm">电话：+86-xxx-xxxx-xxxx</p>
          </div>
          <div className="p-3 border rounded bg-slate-50">
            <h4 className="font-bold">您的权利概览</h4>
            <p className="text-sm">访问权、可携权、被遗忘权、撤回同意权</p>
          </div>
        </div>
      </Section>

      <Section title="五、未成年人保护">
        <p className="mb-4">
          <strong>安思达乐（杭州）信息科技有限公司郑重承诺，将采取特殊保护措施处理未成年人的个人数据。我们将依据GDPR及欧盟成员国相关法律对未成年人进行保护</strong>
        </p>

        <SubSection title="5.1 年龄验证与监护人同意">
          <p>
            <strong>对于未满16周岁的用户，需获得其父母或法定监护人的授权同意。并在监护人完成验证流程后方可使用我们的服务。</strong>鉴于部分欧盟成员国可通过国内法律下调此年龄门槛（最低可至13周岁），若您所在成员国规定较低年龄，则以其规定为准。您有责任了解并遵守您所在成员国的法律规定。
          </p>
          <p className="mt-2">
            我们将会通过监护人注册手机号＋短信验证码的方式核验完成身份确认。
          </p>
          <p className="mt-2">
            在您的所有设备上，启用与应用中的所有个人资料关联的额外家长控制和定制偏好功能。这其中可能包括在应用中允许或屏蔽特定视频，以及允许所有个人资料在应用中订阅频道。
          </p>
          <p className="mt-2">
            <strong>如未经成功完成上述可验证的同意流程，我们将不会为未达法定年龄的用户创建账号或处理其任何个人数据。</strong>当您通过监护人验证后，您可通过【我的-设置-隐私中心-儿童信息管理】对儿童信息进行管理，如查看账号信息，编辑已提交信息等。
          </p>
        </SubSection>

        <SubSection title="5.2 儿童数据的处理原则">
          <p>
            一旦在获得可验证同意后提供服务，我们会仅收集为提供具体服务所必需的最少量数据<strong>。并承诺绝不将儿童数据用于个性化广告、用户画像或任何非直接相关的营销活动。</strong>保证所有向儿童提供的隐私信息均使用清晰、平实的语言，确保其能够理解。
          </p>
        </SubSection>

        <SubSection title="5.3 监护人的权利与行使方式">
          <p>
            作为未成年人的父母或法定监护人，您拥有以下权利：
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>访问权：</strong>查询您孩子提交给我们的个人数据。</li>
            <li><strong>删除权：</strong>要求立即删除您孩子的所有个人数据。</li>
            <li><strong>撤回同意权：</strong>随时撤回已给出的同意，我们将据此停止处理相关数据。</li>
          </ul>
          <p className="mt-2">
            <strong>行使权利的统一渠道：</strong>请通过专属邮箱[xxxxxxxxxxx]与我们联系。为保障儿童安全，我们需要您提供可验证的身份证明（如监护关系证明、双方身份证件）以处理您的请求。我们承诺在收到有效请求后的72小时内予以响应并处理。
          </p>
        </SubSection>

        <SubSection title="5.4 保护承诺">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>主动筛查：</strong>我们将通过技术手段主动筛查并暂停疑似由未成年人未经授权创建的账号。</li>
            <li><strong>员工培训：</strong>所有相关员工均接受过处理儿童数据特殊性的专项培训。</li>
            <li><strong>优先处理：</strong>所有与儿童数据相关的查询和投诉将被标记为最高优先级进行处理。</li>
          </ul>
          <p className="mt-2">
            <strong>您孩子的隐私和安全对我们至关重要。我们将持续审查并更新我们的保护措施，以符合最新的欧盟监管指引。</strong>如发现任何不符合规范的保护措施，您可以通过专属邮箱[xxxxxxxxxxxx]反馈，我们承诺会在收到反馈后的72小时内给予响应并处理。
          </p>
        </SubSection>
      </Section>

      <Section title="六、本政策的更新">
        <p>
          安思达乐公司保留不时修订本用户服务条款的权利。若条款内容发生变更，我们将在 afreshtrip 相关软件及网站公布修订后的版本。重大变更（包括服务模式、权利义务等实质性修改）将额外通过站内通知告知。每次服务条款与隐私政策的更新都将会再次取得您的同意。
        </p>
      </Section>

      <Section title="七、联系我们">
        <p>
          如有任何疑问或建议，您可通过安思达乐官网（www.anstalle.com）或客服热线[xxxxxxxxxxxx]与我们联系，我们将诚挚为您提供帮助。
        </p>
      </Section>
    </div>
  );
};