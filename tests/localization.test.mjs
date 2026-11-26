import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createElement} from 'react';
import {translate,copy} from '../src/lib/translations.ts';
import {translateNode} from '../src/lib/translate-node.ts';
import {education,articles,ebooks,faqs,serviceDetails} from '../src/lib/content.ts';
import {profiles,featuredVideos,channelPlaylists} from '../src/lib/profiles.ts';

test('authored copy has complete non-empty Hindi and Marathi entries',()=>{
  assert.ok(Object.keys(copy).length>300);
  for(const [en,pair] of Object.entries(copy)) {
    assert.equal(pair.length,2,en);
    for(const value of pair) assert.ok(typeof value==='string' && /[\u0900-\u097f]/.test(value), en);
    assert.equal(translate(en,'en'),en);
  }
});
test('all educational, FAQ, article and service-detail content is translated',()=>{
  function visit(value,key='') {
    if(key==='slug')return;
    if(typeof value==='string') for(const lang of ['hi','mr']) assert.notEqual(translate(value,lang),value,`${lang}: ${value}`);
    else if(Array.isArray(value)) value.forEach(v=>visit(v));
    else if(value) Object.entries(value).forEach(([k,v])=>visit(v,k));
  }
  visit({education,articles,ebooks,faqs,serviceDetails});
});
test('public and owner JSX text has authored translations',()=>{
  const brands=new Set(['VIP MAGICAL PHYSIO','VA','VIP Owner','YouTube','Instagram','CSV','&middot;']);
  for(const file of ['pages/public.tsx','pages/admin.tsx','pages/not-found.tsx','components/site.tsx','components/request-form.tsx','components/community.tsx','components/error-boundary.tsx']){
    const ast=ts.createSourceFile(file,fs.readFileSync(new URL('../src/'+file,import.meta.url),'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    function visit(node){
      if(ts.isJsxText(node)) {
        const text=node.text.trim().replace(/\s+/g,' ').replace(/&middot;/g,'·');
        if(/[A-Za-z]{2}/.test(text)&&!brands.has(text)) for(const lang of ['hi','mr']) assert.notEqual(translate(text,lang),text,`${file} ${lang}: ${text}`);
      }
      ts.forEachChild(node,visit);
    }
    visit(ast);
  }
});
test('translation preserves option values and handlers',()=>{
  const onChange=()=>{};
  const node=createElement('select',{value:'CONFIRMED',onChange},createElement('option',null,'CONFIRMED'));
  const localized=translateNode(node,'mr');
  assert.equal(localized.props.value,'CONFIRMED');
  assert.equal(localized.props.onChange,onChange);
  assert.equal(localized.props.children.props.value,'CONFIRMED');
  assert.equal(localized.props.children.props.children,'निश्चित');
});
test('translation preserves links, input values and keys',()=>{
  const link=createElement('a',{href:'/about',key:'stable'},'About');
  const translated=translateNode(link,'hi');
  assert.equal(translated.props.href,'/about');assert.equal(translated.key,'stable');
  assert.equal(translated.props.children,'परिचय');
  assert.equal(translateNode(createElement('input',{value:'About',placeholder:'Title'}),'mr').props.value,'About');
  const list=translateNode([createElement('span',null,'About'),link],'mr');
  assert.ok(list[0].key);assert.equal(list[1].key,'stable');
});
test('profile and service-video mappings use explicit verified identifiers',()=>{
  assert.equal(profiles.whatsapp,'918624860808');
  assert.equal(new URL(profiles.google).hostname,'share.google');
  assert.equal(new URL(profiles.instagram).pathname,'/physiotherapist_shirur/');
  for(const video of featuredVideos) {
    assert.match(video.id,/^[A-Za-z0-9_-]{11}$/);
    assert.ok(channelPlaylists.some(p=>p.id===video.playlist));
    assert.ok(video.services.length);
  }
});
