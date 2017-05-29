import React from 'react';
import {ReCom, set, get} from 'recom';
import {str, sleep} from 'solsort-util';
import _ from 'lodash';

export function fileName(id) {
  let pathSep = window.require('path').sep;
  let dirName = get('upload.dirname');
  dirName = dirName ? dirName + pathSep : '';
  return dirName + id.replace(/[^a-zA-Z0-9]/g, '_') + '.jpg';
}

export function updateCoverStatus() {
  if (window.require) {
    let fsExistsSync = window.require('fs').existsSync;
    fsExistsSync = f => {
      return window.require('fs').existsSync(f);
    };

    set(
      'search.results',
      get('search.results', []).map(o =>
        Object.assign(o, {
          HAS_OWN_COVER: fsExistsSync(fileName(o.pid[0]))
        })
      )
    );
  }
}

export async function search(query, page) {

  page = Math.max(0, page | 0);
  /*
  if (get('search.page') === page && get('search.query') === query) {
    console.log('search already requested');
    return;
  }
  */
  set('search.results', []);
  set('search.page', page);
  set('search.query', query);
  set('search.searching', true);
  set('search.error', undefined);
  set('search.resultCount', undefined);

  let dbc = window.dbcOpenPlatform;
  try {
    let pids;
    let count;

    if (!dbc.connected()) {
      await dbc.connect(
        // TODO: use actual client-id, and local library branch
        '25255a72-8b1d-4c6a-a7bf-c150e2de2a3c',
        '953788b65c480bf59f6eeee4257fb190b5ce1a3ee3fec1af58f8362d78770484'
        //          "@715100", "@715100"
      );
    }

    try {
      let soapString = `xml=
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:os="http://oss.dbc.dk/ns/opensearch">
  <SOAP-ENV:Body>
    <os:searchRequest>
      <os:query>${query}</os:query>
      <os:agency>${get('search.agency')}</os:agency>
      <os:profile>${get('search.profile')}</os:profile>
      <os:start>${page * 10  + 1}</os:start>
      <os:stepValue>10</os:stepValue>
      <os:collectionType>manifestation</os:collectionType>
      <os:outputType>json</os:outputType>
    </os:searchRequest>
  </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
`;
      let result = await fetch('https://opensearch.addi.dk/staging_4.3/', {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST', body: soapString
      });
      result = await result.json();
      result = result.searchResponse.result;
      count = +result.hitCount.$;
      pids = (result.searchResult || []).map(o => o.collection.object[0].identifier.$);
    } catch (e) {
      console.log('error getting result from opensearch', e)
      // error trying to get result from opensearch
      // graceful degradation: using only openplatform instead.
      pids = await window.dbcOpenPlatform.search({
        q: query,
        limit: 10,
        offset: page * 10,
      });
      pids = results.map(o => o.pid[0]);
    }

    let results = await window.dbcOpenPlatform.work({pids: pids});


    if (Array.isArray(results)) {
      results = results.map(o =>
        Object.assign(o, {
          TITLE: o.dcTitle || o.dcTitleFull || o.title || [],
          CREATOR: o.dcCreator || o.creatorAut || o.creator || []
        })
      );
    }

    let thumbs = await window.dbcOpenPlatform.work({
      pids: pids,
      fields: ['coverUrlThumbnail']
    });
    for (let i = 0; i < thumbs.length; ++i) {
      results[i].coverUrlThumbnail = thumbs[i].coverUrlThumbnail;
    }

    set('search.results', results);
    set('search.resultCount', count);

    // wait until results has been set
    await sleep();
    for (let i = 0; !_.isEqual(results, get('search.results')); ++i) {
      await sleep(10);
      if (i >= 100) {
        throw new Error('changes to results did not get through');
      }
    }
  } catch (e) {
    console.log(e);
    set('search.error', str(e));
  }
  updateCoverStatus();
  set('search.searching', false);
}
