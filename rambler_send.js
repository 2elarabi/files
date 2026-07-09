function setNativeValue(element, value) {
    const lastValue = element.value;
    element.value = value;

    const event = new Event("input", { bubbles: true });
    // React 17+ special handling
    const tracker = element._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }

    element.dispatchEvent(event);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fillRamblerReceivers(emails) {

    const input = document.querySelector("#receivers");

    if (!input) {
        console.error("Receiver input not found!");
        return false;
    }

    input.focus();

    const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
    ).set;

    for (const email of emails) {

        // Count existing recipient badges
        const before = document.querySelectorAll(".EmailBadge-root-hS").length;

        // Type email
        setter.call(input, email);

        input.dispatchEvent(new Event("input", {
            bubbles: true
        }));

        await sleep(150);

        // Press Enter
        ["keydown","keypress","keyup"].forEach(type => {

            input.dispatchEvent(new KeyboardEvent(type,{
                key:"Enter",
                code:"Enter",
                keyCode:13,
                which:13,
                bubbles:true
            }));

        });

        // Wait until Rambler creates the new badge
        let added = false;

        for(let i=0;i<40;i++){

            const now =
            document.querySelectorAll(".EmailBadge-root-hS").length;

            if(now > before){

                added = true;
                break;
            }

            await sleep(100);
        }

        if(added){

            console.log("✅ Added:",email);

        }else{

            console.warn("❌ Failed:",email);

        }

        await sleep(250);

    }

    console.log("Finished adding all recipients.");

    return true;

}

function fillRamblerReceiver(email) {
    const input = document.querySelector('#receivers');

    if (!input) {
        console.error("Rambler input field not found!");
        return false;
    }

    // Method 1: Dispatch multiple events (most effective)
    input.focus();

    // Set the value
    input.value = email;

    // Trigger all possible events that Rambler might be listening to
    const events = ['input', 'change', 'keydown', 'keyup', 'blur'];

    events.forEach(eventType => {
        const event = new Event(eventType, { bubbles: true });
        input.dispatchEvent(event);
    });

    // Extra React-friendly way (very important for Rambler)
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, 
        "value"
    ).set;

    nativeInputValueSetter.call(input, email);

    // Final events
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    console.log("✅ Email filled:", email);
    return true;
}
function setHtmlInTinyMCE(htmlContent) {
    // Wait a bit in case the editor is still loading
    setTimeout(() => {

        // Method 1: Try activeEditor (most common)
        if (tinymce.activeEditor) {
            tinymce.activeEditor.setContent(htmlContent);
            console.log("✅ HTML inserted using activeEditor");
            return;
        }

        // Method 2: Find by ID (if you know the textarea id)
        const editor = tinymce.get('receivers');   // change if the id is different
        if (editor) {
            editor.setContent(htmlContent);
            console.log("✅ HTML inserted using tinymce.get()");
            return;
        }

        // Method 3: Force using execCommand (sometimes needed)
        if (tinymce.activeEditor) {
            tinymce.activeEditor.execCommand('mceSetContent', false, htmlContent);
            console.log("✅ HTML inserted using mceSetContent command");
        }

    }, 800);   // ← increase to 1500 if still not working
}

let image_links = [
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjuTTkYVkxAOBddVIf6b1zTCLEqwMH0vj3W06Ws1SsEs28M_iMSm89D2_Dy5cEZPg_hsmdbYjTY8M-ePzaLXfvu2SzeoYpBtJ0vyFd-UYbGLTw9sQK3FUgcrd5wqJXXeoktyBchJIgpBrxAENLP6t9v6hG7A58VhrTCerWOU6QFuabWqgednr_pK5s6OPzi/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgYSdx0UOFpUmRyiwBV598Pe1H3vz3mCvx606C9ppyV27hdqFjRPDBekoI6IyXiAHBwK7BPFaN6-9dxdlvW2ur5XJ83w7A24n7rV25Sgq_aYTifyyY12krJwQzGG7vt8Dk-IOloqTR8_Uxn2IpzsOvqexwH2W64EnZaYKkDDkJ4_jZzwzsbixN0s43Jh6Jq/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZLb7szYRZeOO1ZafGtJAczKXWwaAnyShqb_9ZkUzleKM-5-xR5rWxIOaaEjVlx5sPY6yj1IH0uBliYBori0JyeQ9llGj-tXWd1ojmVXUkZRsuKRA2HMwPEgs4Apx-FbNB4Kr6Ivc8C3OKIZocCYSAVX8B1PHhECje3-bN8ZgaDC8pAkKqhPeunTDttLMI/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi68icW3nVtdUVa7mL4gCVspHai_k4lAlJttGP_QbpWlKRdWxm5UUKgwzLHiHiT-olstv2NegCGi5ZI5rSSYHJWizDXWiOVI-xU8wMgTuR9wTFutim7z1Vn4n4Ss9p6Uxoz93On0_YMlmfSNeiOMCUu05fackfZC_j8oU60JZBxeGDe272e3hsOIlTyCs0R/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-0qvNV9oh7Ejv2oHzBVfoDLK7WQ_3-lijysvAMrGbRjd7Pcz1wvv7iEAEfGBdZLm_JINw7t6tnWbH519Su9GKVf9woFlI97GXbGM2AG-yPbmzjMW6rZQ3YOlneKxlC6ljs0AYkC1r2Ia9KjaZf6yW6cnEwq4ZJ2UVZ7HPGPCjvExxFS2eyYgWGa_iOkzX/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhGX7QQ4kw1XzGkc4dMqAuinJrY8NVZEF1Vn7EgT0xtl9tTN1oFdM-ONaGY5jcNWax8Uq48a6Csjx0RAzp0mPL8anQ_PAFY1-MDByN9vdIljHUVRPEqEo46X-7Q78nTlLG0YC9VqAXD802H2KlPwXBmsYaZMpjms5UX-8Nfhr7tIQ3qCfeLY6XLLN73dJEA/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRIf-SQ4mJ7hvQ9awzmkuoFpKKz-mys-WiARSbXbTbeoEXevBz-9JBA-zuuc5WO2UekYPqikxpsPuyGlP184pgkz3oLT9sETjSQvz6rqEYoRpvXjE5C-T8MTP4XeQoDKjOYrEhvDL_guAHtnv2bfjHVO0gRS5UPQ-NGMXI3KcRR5uhPgBQHOmenY3B1ol9/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgUPSYTfja-FXSbfV1PTkMVRmTFPa5oZnImpmtlttsD4vJUeOULyKlbDQDR9pur6bp3N-5TrfvyFgZl-er9KtE_Vne1QR85PNbPqkqoryIff-rII-ByQeoJ1EP2lH_PsaDS-T7Ul_x9IAYA5eOZ8GrqoY_NvIMTHhPye3ykdFQMAP2wrUs2-1W4Lz0VUMVZ/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyAJfLgURuPFyfYR0bkjmrHG5LDEghlttuSGWo09GGNsaOCj5c_RqSDHnugPKZxXGBlBOStyD3l14Dgx1SuTWeqUT1MIGdb3sc2CzlZNb3vgmE43tmBNDju6r-L1HSrnA1veXrqR5U8DySLEPBpuxvRzmOmsanDgBi47VgWBaJZcEsbtzuLC54VQ69SXgP/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvYPgkLK4kMan9c28G6crNiyfpOOWYXgyXjoSN3VUqCXcK9qXU96rK-7CtePvVg8VASL1_6G_C4ZWZdoJmTgvak95O3kCI-ySPvpjTVbjg7Bc6-dOkJGB6cGW8pBGOhG48km8bvLLcGXfnn5gSYNJ8dwMXXdnUYXVLqp47N7d5qvZx6-T0JX_GJ7CdnXwx/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_VbgRciBBETfFCfqR-z5naI7FJ0Wq0dB1_zdtjaSa9J1PdOXoeBB7iOv4yYAPn7D7szSf202kpcEnF58J21oSvHSGwDfZsPthUjhhV7bpjQKViISAcPXQCBGhuZOeQjtPdKsW7NLS3Tb6tUu6rNe7aJxdwD5H_8W6lnCdIRjDOBweos2Za4Q88fgR3Pcr/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOc5jsCF9n3fF0v3oZqLdrsUqf-hJhTfw1ZBYRm_3lwwuNjLLiGgtoJHHnYMrNIWg2uJ4bQQ26LafGaWM0wEQ-gVRgdjHyagk0hyyGzFHt8dqvmI8-y7rt_Pudfs3dWmvQZyjEj56XJN6LJiFN9DFMd0zFgY76ugrZozWbYlbSfA3A1mtP6pq37T_xy9hd/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5MTd1DIkyTJs6uanB9_FfBrhDelxWi-PofGGN1VGruZjxAeQs2Qn0CfvT-S8_nVq9UEWgDluTzXbIH72whuCMcd8uTJB2aCZLm2YYa7wWrcuhOTsXj_kviuqxXm25Jfp4Swy-ZLm9cd4FBxjI0tG8ZpYcOPBE9_vyFaldmhH2hiBJM3ubBEK_iolm2_kL/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0FUF3jJApXMk-8YzMB9u3YWGDZAHjB3_PngTXWK64oy_pVXYbWKJtcVkKN36fvv6Tm0iWb9sPTEj_cCRyhCeAHwW0o9v-aChCqcvOppeVU7f_7MvSu1uc4I_fkh9OdzYrt6GmFlASHQ4mZk_8z3nqHHHzO4p5fca0_zFzUdu4PnJKOKAPiKXWB1wWvwF1/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiSS_Gp9yl-K_-J5wraB3eo254AdqPCDKapOXSj7EtxJT4FhAHnz7aWIJDb5Osr1OpyySe22PstesrgxATEzGvkEmPdDO28emiJP2Sml0_OMynOc68O9BCeltdEsKV7I89ygvImHThKU3e5W-nfjYhQ4FG3q_uhIcaf7RvKach7jNmR4_nwA94cZrTN9NQ/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZ3QAJZPnShLHZXR-sBUpn273slaOrrg8HnNGSwtqdNwB7QtA4P63jG0Lqqji6AFJ_1lm3CaOJqbuOsua3FY_-eCanIX1vn9xEQ1YShitgBRcA0kF_ZgoI_SobviOHLvcqnncqqLH5E7o8gKcn85D8AXpdvQhgbvNw5VdbjSS1IBCqHH2sgZEXYiexVkMh/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjk5mRhVQXPoeL-ZScwQ6hyphenhyphen8j56rossPzziLD1Ir-FLg1zyJN3AzJsf5mDEKJwHXSX8zd4WPHLCNUjhdnHw_uS2ronhKjSVQmKo6JKbterDZVJtWM9QE3sdwuFMEicMSIpBiIw7f2UFYKGMzlHg057d5uVOYTrAh5iTQCZtqLAq4393L0QzP6oSyJ_gefgh/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_e82RIv_bCEQ5031ReWRE9UBUMDxLblywozd_gCfwsgh42lfmGKc5NPi7tmiyTs0YNtzilMlRUqRPD3a7dlpCMfvgEalOGi0W34bHUOk-WCpWxZO0XqY9GZIuesTEg5NuFP5qWwDVjtpOWQMTTczlcs7NacSm_7pA9yOC7VMKqap_QYnuYseh-YTeNRq_/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgaOsEOrgGNufoCBUrxVdh81N-kIC1nXp0fwn5aZ_M8CsnRyJpCOG8VYmtH6iT_NutktkSs_VoxhuTXdaJYuxMDhpPWXX-Qz0qAUF9ltxz67Ot9QnLBLvvNRezvQB5rc0mP3_P0Wg5lREYXK2N6Ir0nCKhGvS4Vkv6HNDnHtPYLajKp-wPLm-zdP1HLmHC/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjuD-5edMY1pB_YPBFJOaR8p80AOkddpPKLPHxZWc7VMs92ZFVEmBqNWB5RZA10L8eZeqZZ3aGKewgOeKz1SqGGxQ0HJUg9i4nl7ksR5RnoPh5xdSmmJhJwdBadqI95DiPCnWOpkjIxGW18uYUOHhmRBb8a-J3t52w9_SQZh4AezDGLtuZUVEpeHZZx4eN/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOZjGcTbFcrATfnqsFlhWl-Ut484LKpHhuXdohTAlLTvUnE_OZArWGM5Hk1ZGJTC86g8Ueq-pfTgsI64qkRbrUV5KQsMA5nA-ckQox0s4wFO2r-n0AAMIvyWTwZ82IW-h6XEtEdMudgroMSl1ipH6ukNFOQ-w-MrPWkwlHHVa6k1oUkMoW313wREOJ2NM4/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqviXcZ1NOW0EdgN5aJfNkN87XOg6XFfhlKMqB0VQX8Cm0VGmuJp145qzfHISrpqypFX8vfJusWvBggp7q2BTUR9um6j3b5QHjNqypgoki5rkDZdSokp_73aRFe9kNdQRhgITRl9yA9FoeOdJMeSLtyZf_D-esyFLj5QIIHwsiacFmf-QSFIRcibTE5rA7/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_c2SY9tSRxonSr4_ibRKPLiSf9e0b0At9JRoX-JXUOImcXzE7VDPEAepQijVQct6lDricVzdkw4-Vqjs-SqSDPfTR3JNQLMA8AumZvCEoBt6QktV2X_enfT8jJb8h8SnGVblG9ZwlbokxB_PGViKkjATsUYwujNXs7BEUCkVidgKgOja9SysLFf_lVg-J/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNL_5LFf0YkgLr1tz2iCqq3uhWTY8x9aUnaFZkixXsoU1MUwEKTqOt17ctL6EGLz2HlMksOXtyo90iTSEurI5tJHLCIq8khS3sCKrlxX3FkI1YiJAUrdYhrt1WXyUGkIbFkYkbz2RCy8P6WJtLhY1qwWIm2GLAbSW6shUsWGrMRSBiLIzOCB3GebWwPllG/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgozKbgOKfEhUVVAtjH_JgQpYYk9sAlNeiZ0ubVcszmnknhRtdQhxmFsioj13D4FgD5IitrVjR6EpnGjSTDASgf0G8DFigDmS_d99yi_ocILmSgOa35sXDCZCBtbvf9W53darCbldAhPPQQ67ZaOjU6HQrLuwKyUKfvLZgPKDudasSeOwH-HSle8djq24tl/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFbMtRQMM64VqlZ8j7_C96t01c5Gniush_aBQcItXr1ACc34ArPxaCyOdEpT7RoIPiU4rGtjY79C8ZxrGS-L29u0Xjh7Zdkesr6Nb8c1HySZyLdL6ViSRhF4ooxRDLpdVti4OPtiShX2zj5Oj-fmOtfjYGbztbfpDhpO34LfEejp2ijb3Ha_mg5rm1GOm0/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmrvH60B0FTIRXg835LyF_5SAYL3xkdMnVG3cVVkqnUrRdlpUhrDLmaD_tSzs5B90QiBwFSzPUsXsWwlCpAte6UEw6gfk91gvsbHW3YuucZ6sJbwJhAx5ck0kQTC6kZUSFLpmSjvVPOPGt7PkzFMFvciU2BKL9q4v4EUgglG6PpPXnu0k2jGwpD7rgN9i8/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWPES5HbsFZ52v_Zcq4pjrVMW61GdojOnYefvQtE5YSWHOOs0bhCIO9S6ZJFWj5wnVLr8p6KF6rCg8JDm1PILhTuuRa9Itd6o50Ii97PVaEJ18IV2hnevfJdCmcT193iVZvtk8wxJEasRi-4crn5hyeDEaJNAkxVlRvp-vHDZ1IqMydoxr3Z2nsm1pvr8z/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png"

]

let image_links_2 = [
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjuTTkYVkxAOBddVIf6b1zTCLEqwMH0vj3W06Ws1SsEs28M_iMSm89D2_Dy5cEZPg_hsmdbYjTY8M-ePzaLXfvu2SzeoYpBtJ0vyFd-UYbGLTw9sQK3FUgcrd5wqJXXeoktyBchJIgpBrxAENLP6t9v6hG7A58VhrTCerWOU6QFuabWqgednr_pK5s6OPzi/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgYSdx0UOFpUmRyiwBV598Pe1H3vz3mCvx606C9ppyV27hdqFjRPDBekoI6IyXiAHBwK7BPFaN6-9dxdlvW2ur5XJ83w7A24n7rV25Sgq_aYTifyyY12krJwQzGG7vt8Dk-IOloqTR8_Uxn2IpzsOvqexwH2W64EnZaYKkDDkJ4_jZzwzsbixN0s43Jh6Jq/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZLb7szYRZeOO1ZafGtJAczKXWwaAnyShqb_9ZkUzleKM-5-xR5rWxIOaaEjVlx5sPY6yj1IH0uBliYBori0JyeQ9llGj-tXWd1ojmVXUkZRsuKRA2HMwPEgs4Apx-FbNB4Kr6Ivc8C3OKIZocCYSAVX8B1PHhECje3-bN8ZgaDC8pAkKqhPeunTDttLMI/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi68icW3nVtdUVa7mL4gCVspHai_k4lAlJttGP_QbpWlKRdWxm5UUKgwzLHiHiT-olstv2NegCGi5ZI5rSSYHJWizDXWiOVI-xU8wMgTuR9wTFutim7z1Vn4n4Ss9p6Uxoz93On0_YMlmfSNeiOMCUu05fackfZC_j8oU60JZBxeGDe272e3hsOIlTyCs0R/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-0qvNV9oh7Ejv2oHzBVfoDLK7WQ_3-lijysvAMrGbRjd7Pcz1wvv7iEAEfGBdZLm_JINw7t6tnWbH519Su9GKVf9woFlI97GXbGM2AG-yPbmzjMW6rZQ3YOlneKxlC6ljs0AYkC1r2Ia9KjaZf6yW6cnEwq4ZJ2UVZ7HPGPCjvExxFS2eyYgWGa_iOkzX/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhGX7QQ4kw1XzGkc4dMqAuinJrY8NVZEF1Vn7EgT0xtl9tTN1oFdM-ONaGY5jcNWax8Uq48a6Csjx0RAzp0mPL8anQ_PAFY1-MDByN9vdIljHUVRPEqEo46X-7Q78nTlLG0YC9VqAXD802H2KlPwXBmsYaZMpjms5UX-8Nfhr7tIQ3qCfeLY6XLLN73dJEA/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRIf-SQ4mJ7hvQ9awzmkuoFpKKz-mys-WiARSbXbTbeoEXevBz-9JBA-zuuc5WO2UekYPqikxpsPuyGlP184pgkz3oLT9sETjSQvz6rqEYoRpvXjE5C-T8MTP4XeQoDKjOYrEhvDL_guAHtnv2bfjHVO0gRS5UPQ-NGMXI3KcRR5uhPgBQHOmenY3B1ol9/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgUPSYTfja-FXSbfV1PTkMVRmTFPa5oZnImpmtlttsD4vJUeOULyKlbDQDR9pur6bp3N-5TrfvyFgZl-er9KtE_Vne1QR85PNbPqkqoryIff-rII-ByQeoJ1EP2lH_PsaDS-T7Ul_x9IAYA5eOZ8GrqoY_NvIMTHhPye3ykdFQMAP2wrUs2-1W4Lz0VUMVZ/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyAJfLgURuPFyfYR0bkjmrHG5LDEghlttuSGWo09GGNsaOCj5c_RqSDHnugPKZxXGBlBOStyD3l14Dgx1SuTWeqUT1MIGdb3sc2CzlZNb3vgmE43tmBNDju6r-L1HSrnA1veXrqR5U8DySLEPBpuxvRzmOmsanDgBi47VgWBaJZcEsbtzuLC54VQ69SXgP/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvYPgkLK4kMan9c28G6crNiyfpOOWYXgyXjoSN3VUqCXcK9qXU96rK-7CtePvVg8VASL1_6G_C4ZWZdoJmTgvak95O3kCI-ySPvpjTVbjg7Bc6-dOkJGB6cGW8pBGOhG48km8bvLLcGXfnn5gSYNJ8dwMXXdnUYXVLqp47N7d5qvZx6-T0JX_GJ7CdnXwx/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_VbgRciBBETfFCfqR-z5naI7FJ0Wq0dB1_zdtjaSa9J1PdOXoeBB7iOv4yYAPn7D7szSf202kpcEnF58J21oSvHSGwDfZsPthUjhhV7bpjQKViISAcPXQCBGhuZOeQjtPdKsW7NLS3Tb6tUu6rNe7aJxdwD5H_8W6lnCdIRjDOBweos2Za4Q88fgR3Pcr/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOc5jsCF9n3fF0v3oZqLdrsUqf-hJhTfw1ZBYRm_3lwwuNjLLiGgtoJHHnYMrNIWg2uJ4bQQ26LafGaWM0wEQ-gVRgdjHyagk0hyyGzFHt8dqvmI8-y7rt_Pudfs3dWmvQZyjEj56XJN6LJiFN9DFMd0zFgY76ugrZozWbYlbSfA3A1mtP6pq37T_xy9hd/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg5MTd1DIkyTJs6uanB9_FfBrhDelxWi-PofGGN1VGruZjxAeQs2Qn0CfvT-S8_nVq9UEWgDluTzXbIH72whuCMcd8uTJB2aCZLm2YYa7wWrcuhOTsXj_kviuqxXm25Jfp4Swy-ZLm9cd4FBxjI0tG8ZpYcOPBE9_vyFaldmhH2hiBJM3ubBEK_iolm2_kL/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0FUF3jJApXMk-8YzMB9u3YWGDZAHjB3_PngTXWK64oy_pVXYbWKJtcVkKN36fvv6Tm0iWb9sPTEj_cCRyhCeAHwW0o9v-aChCqcvOppeVU7f_7MvSu1uc4I_fkh9OdzYrt6GmFlASHQ4mZk_8z3nqHHHzO4p5fca0_zFzUdu4PnJKOKAPiKXWB1wWvwF1/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiSS_Gp9yl-K_-J5wraB3eo254AdqPCDKapOXSj7EtxJT4FhAHnz7aWIJDb5Osr1OpyySe22PstesrgxATEzGvkEmPdDO28emiJP2Sml0_OMynOc68O9BCeltdEsKV7I89ygvImHThKU3e5W-nfjYhQ4FG3q_uhIcaf7RvKach7jNmR4_nwA94cZrTN9NQ/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZ3QAJZPnShLHZXR-sBUpn273slaOrrg8HnNGSwtqdNwB7QtA4P63jG0Lqqji6AFJ_1lm3CaOJqbuOsua3FY_-eCanIX1vn9xEQ1YShitgBRcA0kF_ZgoI_SobviOHLvcqnncqqLH5E7o8gKcn85D8AXpdvQhgbvNw5VdbjSS1IBCqHH2sgZEXYiexVkMh/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjk5mRhVQXPoeL-ZScwQ6hyphenhyphen8j56rossPzziLD1Ir-FLg1zyJN3AzJsf5mDEKJwHXSX8zd4WPHLCNUjhdnHw_uS2ronhKjSVQmKo6JKbterDZVJtWM9QE3sdwuFMEicMSIpBiIw7f2UFYKGMzlHg057d5uVOYTrAh5iTQCZtqLAq4393L0QzP6oSyJ_gefgh/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_e82RIv_bCEQ5031ReWRE9UBUMDxLblywozd_gCfwsgh42lfmGKc5NPi7tmiyTs0YNtzilMlRUqRPD3a7dlpCMfvgEalOGi0W34bHUOk-WCpWxZO0XqY9GZIuesTEg5NuFP5qWwDVjtpOWQMTTczlcs7NacSm_7pA9yOC7VMKqap_QYnuYseh-YTeNRq_/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgaOsEOrgGNufoCBUrxVdh81N-kIC1nXp0fwn5aZ_M8CsnRyJpCOG8VYmtH6iT_NutktkSs_VoxhuTXdaJYuxMDhpPWXX-Qz0qAUF9ltxz67Ot9QnLBLvvNRezvQB5rc0mP3_P0Wg5lREYXK2N6Ir0nCKhGvS4Vkv6HNDnHtPYLajKp-wPLm-zdP1HLmHC/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjuD-5edMY1pB_YPBFJOaR8p80AOkddpPKLPHxZWc7VMs92ZFVEmBqNWB5RZA10L8eZeqZZ3aGKewgOeKz1SqGGxQ0HJUg9i4nl7ksR5RnoPh5xdSmmJhJwdBadqI95DiPCnWOpkjIxGW18uYUOHhmRBb8a-J3t52w9_SQZh4AezDGLtuZUVEpeHZZx4eN/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjOZjGcTbFcrATfnqsFlhWl-Ut484LKpHhuXdohTAlLTvUnE_OZArWGM5Hk1ZGJTC86g8Ueq-pfTgsI64qkRbrUV5KQsMA5nA-ckQox0s4wFO2r-n0AAMIvyWTwZ82IW-h6XEtEdMudgroMSl1ipH6ukNFOQ-w-MrPWkwlHHVa6k1oUkMoW313wREOJ2NM4/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqviXcZ1NOW0EdgN5aJfNkN87XOg6XFfhlKMqB0VQX8Cm0VGmuJp145qzfHISrpqypFX8vfJusWvBggp7q2BTUR9um6j3b5QHjNqypgoki5rkDZdSokp_73aRFe9kNdQRhgITRl9yA9FoeOdJMeSLtyZf_D-esyFLj5QIIHwsiacFmf-QSFIRcibTE5rA7/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh_c2SY9tSRxonSr4_ibRKPLiSf9e0b0At9JRoX-JXUOImcXzE7VDPEAepQijVQct6lDricVzdkw4-Vqjs-SqSDPfTR3JNQLMA8AumZvCEoBt6QktV2X_enfT8jJb8h8SnGVblG9ZwlbokxB_PGViKkjATsUYwujNXs7BEUCkVidgKgOja9SysLFf_lVg-J/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNL_5LFf0YkgLr1tz2iCqq3uhWTY8x9aUnaFZkixXsoU1MUwEKTqOt17ctL6EGLz2HlMksOXtyo90iTSEurI5tJHLCIq8khS3sCKrlxX3FkI1YiJAUrdYhrt1WXyUGkIbFkYkbz2RCy8P6WJtLhY1qwWIm2GLAbSW6shUsWGrMRSBiLIzOCB3GebWwPllG/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgozKbgOKfEhUVVAtjH_JgQpYYk9sAlNeiZ0ubVcszmnknhRtdQhxmFsioj13D4FgD5IitrVjR6EpnGjSTDASgf0G8DFigDmS_d99yi_ocILmSgOa35sXDCZCBtbvf9W53darCbldAhPPQQ67ZaOjU6HQrLuwKyUKfvLZgPKDudasSeOwH-HSle8djq24tl/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiFbMtRQMM64VqlZ8j7_C96t01c5Gniush_aBQcItXr1ACc34ArPxaCyOdEpT7RoIPiU4rGtjY79C8ZxrGS-L29u0Xjh7Zdkesr6Nb8c1HySZyLdL6ViSRhF4ooxRDLpdVti4OPtiShX2zj5Oj-fmOtfjYGbztbfpDhpO34LfEejp2ijb3Ha_mg5rm1GOm0/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmrvH60B0FTIRXg835LyF_5SAYL3xkdMnVG3cVVkqnUrRdlpUhrDLmaD_tSzs5B90QiBwFSzPUsXsWwlCpAte6UEw6gfk91gvsbHW3YuucZ6sJbwJhAx5ck0kQTC6kZUSFLpmSjvVPOPGt7PkzFMFvciU2BKL9q4v4EUgglG6PpPXnu0k2jGwpD7rgN9i8/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png",
"//blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWPES5HbsFZ52v_Zcq4pjrVMW61GdojOnYefvQtE5YSWHOOs0bhCIO9S6ZJFWj5wnVLr8p6KF6rCg8JDm1PILhTuuRa9Itd6o50Ii97PVaEJ18IV2hnevfJdCmcT193iVZvtk8wxJEasRi-4crn5hyeDEaJNAkxVlRvp-vHDZ1IqMydoxr3Z2nsm1pvr8z/s1536/ChatGPT%20Image%20Jul%207,%202026,%2002_55_23%20PM.png"
]

let subjects = [
	"Claim Your FREE Lifetime Premium IPTV Subscription – Limited Time",
	"Get Your FREE Lifetime Premium IPTV Subscription Today",
	"Activate Your FREE Lifetime Premium IPTV Subscription",
	"Start Watching with Your FREE Lifetime Premium IPTV Subscription",
	"Enjoy a FREE Lifetime Premium IPTV Subscription",
	"Your FREE Lifetime Premium IPTV Subscription Is Ready",
	"Receive Your FREE Lifetime Premium IPTV Subscription",
	"Unlock Your FREE Lifetime Premium IPTV Subscription",
	"Access Your FREE Lifetime Premium IPTV Subscription",
	"Claim Your Complimentary Lifetime Premium IPTV Subscription",
	"Experience Premium Entertainment with a FREE Lifetime IPTV Subscription"
]

// === Usage Example ===
const myHtml_1 = `
	<p>Hi Dear valued customer,</p>
	<p>We have something special for our loyal clients.</p>
	<p>For a limited time, we're offering a <strong>FREE IPTV subscription</strong> with access to premium entertainment, including:</p>
	<p>&bull; Live TV channels<br />&bull; Movies &amp; TV Shows<br />&bull; Sports Events<br />&bull; International Channels</p>
	<p>No hidden fees. Just our way of saying thank you.</p>
	<p>&nbsp;Send us a quick reply to email below to activate your free subscription before the offer expires:</p>
	<p><span><strong>&nbsp;<span style="background-color: #ffff00; color: #0000ff;">free-iptv@meetatalk.online</span></strong></span></p>
	<p>If you have any questions, simply reply to this email&mdash;we're happy to help.</p>
	<p>Best wishes,<br /><span>ADAM HARDISON</span></p>
`;

const myHtml = `
	<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
		<tr>
			<td align="center">
				<img
					src="[img_link]"
					width="600"
					style="max-width:600px; width:100%; height:auto; display:block; border:0;"
				/>
				<img
					src="[img_link_2]"
					width="600"
					style="max-width:600px; width:100%; height:auto; display:block; border:0;"
				/>
			</td>
		</tr>
	</table>
`;
let emails = ['Elarabi.ennaji@outlook.com','youssef.chippo@outlook.com','faysal.momo@outlook.com','James.Grunwald1@hotmail.com','Charles.Threlkeld@hotmail.com']
let gmail_username = document.querySelector('[class="User-username-Jm"]').innerText
let recepient_nb = 10;
let max_emails_to_send = 200
let index = 0;
let inc = 0;
let emails_per_email = 10;
let max_inc = max_emails_to_send/emails_per_email

async function func() {
	if (inc >= max_inc) {
		clearInterval(myVar);
		console.log('Fin');
		return;
	}
  //const res = await fetch(`https://script.google.com/macros/s/AKfycby-IvckQJptcAh4CUZMrHlwBpRMHeZhj30aN9PKboscdhUQCHczeY3T41F7VgWJvwIW/exec?gmail=${gmail_username}&recepient_nb=${recepient_nb}`);
  const res = await fetch(`https://script.google.com/macros/s/AKfycbwViOc6rQWz3_dtnKmMeFHbHrSXzCJZJPd7zNS5czofC12_Q95FKlgjBYxX-46nt_IV/exec?gmail=${gmail_username}&recepient_nb=${recepient_nb}`);
  const data = await res.json();

  emails = data.emails
  //emails.push('youssef.chippo@outlook.com');
  let subject_ = subjects[inc % subjects.length]
  let img_ = image_links[inc % image_links.length]
  let img_2 = image_links_2[inc % image_links_2.length]
  let em = emails[inc]
  let msg = myHtml;
  msg = msg.replaceAll("[img_link]", img_);
  msg = msg.replaceAll("[img_link_2]", img_2);

  // Simulate Gmail actions
  let compose_ = document.querySelector('[data-mail-desktop="compose::list_view::new_letter"]')
  compose_.click()

  setTimeout(async () => {
	await fillRamblerReceivers(emails);
    //fillRamblerReceiver(em);

    setTimeout(() => {
	  let subject = document.querySelector('[id="subject"]')
	  setNativeValue(subject, subject_)

      setHtmlInTinyMCE(msg);
	  setTimeout(() => {
		  let send_s = document.querySelectorAll('[data-mail-desktop="compose::header_tools::1::send_button"]')
		  send_s[0].click()
	  }, 3000)
	  
    }, 1000);
  }, 2000);

  inc++;
}
func()
// run every 15 minutes
let myVar = setInterval(func, (900*1000));
